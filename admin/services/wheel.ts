import type { Wheel } from "../models/wheel";

class WheelService {
  private endpoint = "/wp-json/wolf-memberships/v1";

  async items(options?: {
    filters?: Record<string, string>;
    page?: number;
    size?: number;
  }): Promise<{ items: Wheel[]; total: number }> {
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
      `${this.endpoint}/wheels?${queryParams.toString()}`,
    );
    const data = await res.json();

    return {
      items: data.items.map((item: any) => this.unserialize(item)) as Wheel[],
      total: data.total,
    };
  }

  async item(wheelId: number): Promise<Wheel> {
    const res = await fetch(
      `${this.endpoint}/wheels/${wheelId}`,
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

  async update(wheelId: number, data: any) {
    const res = await fetch(
      `${this.endpoint}/wheels/${wheelId}`,
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

  async delete(wheelId: number) {
    await fetch(`${this.endpoint}/wheels/${wheelId}`, {
      method: "DELETE",
    });
  }

  async count(filters?: Record<string, string>) {
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
      `${this.endpoint}/wheels?${queryParams.toString()}`,
    );
    const data = await res.json();
    return data.total;
  }


  private serialize(data: any) {
    return {
      ...data,
    };
  }

  private unserialize(data: any) {
    return {
      ...data,
    };
  }
}

export default new WheelService();
