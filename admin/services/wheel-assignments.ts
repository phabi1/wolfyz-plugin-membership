import type { WheelAssignment } from "../models/wheel-assignment";

class WheelAssignmentsService {
  private endpoint = "/wp-json/wolf-memberships/v1";

  async items(
    memberId: number,
    options?: {
      filters?: Record<string, string>;
      page?: number;
      size?: number;
    },
  ): Promise<{ items: WheelAssignment[]; total: number }> {
    const { page = 1, size = 20 } = options || {};

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    if (options?.filters) {
      let filters: string[] = [];
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value) {
          filters.push(`${key}:like:${value}`);
        }
      });
      queryParams.append("filters", filters.join(";"));
    }

    const res = await fetch(
      `${this.endpoint}/members/${memberId}/wheels?${queryParams.toString()}`,
    );
    const data = await res.json();

    return {
      items: data.items.map((item: any) =>
        this.unserialize(item),
      ) as WheelAssignment[],
      total: data.total,
    };
  }

  async item(
    memberId: number,
    wheelAssignmentId: number,
  ): Promise<WheelAssignment> {
    const res = await fetch(
      `${this.endpoint}/members/${memberId}/wheels/${wheelAssignmentId}`,
    );
    const data = await res.json();
    const entity = this.unserialize(data);

    return entity;
  }

  async create(memberId: number, data: any) {
    const res = await fetch(`${this.endpoint}/members/${memberId}/wheels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async update(memberId: number, wheelAssignmentId: number, data: any) {
    const res = await fetch(
      `${this.endpoint}/members/${memberId}/wheels/${wheelAssignmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.serialize(data)),
      },
    );
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async delete(memberId: number, wheelAssignmentId: number) {
    await fetch(
      `${this.endpoint}/members/${memberId}/wheels/${wheelAssignmentId}`,
      {
        method: "DELETE",
      },
    );
  }

  async count(memberId: number, filters?: Record<string, string>) {
    const queryParams = new URLSearchParams({ size: "1" });
    if (filters) {
      let filtersArr: string[] = [];
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filtersArr.push(`${key}:like:${value}`);
        }
      });
      queryParams.append("filters", filtersArr.join(";"));
    }

    const res = await fetch(
      `${this.endpoint}/members/${memberId}/wheels?${queryParams.toString()}`,
    );
    const data = await res.json();
    return data.total;
  }

  private serialize(data: any) {
    return {
      ...data,
      assigned_at: data.assigned_at
        ? Math.floor(new Date(data.assigned_at).getTime() / 1000)
        : null,
    };
  }

  private unserialize(data: any) {
    return {
      ...data,
      assigned_at: data.assigned_at
        ? new Date(data.assigned_at * 1000).toISOString()
        : null,
    };
  }
}

export default new WheelAssignmentsService();
