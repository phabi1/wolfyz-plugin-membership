import type { Session } from "../models/session";

class SessionService {
  private endpoint = "/wp-json/wolf-memberships/v1/campaigns";

  async items(
    campaignId: number,
    options?: {
      filters?: Record<string, string>;
      page?: number;
      size?: number;
    },
  ): Promise<{ items: Session[]; total: number }> {
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
      `${this.endpoint}/${campaignId}/sessions?${queryParams.toString()}`,
    );
    const data = await res.json();

    return {
      items: data.items.map((item: any) => this.unserialize(item)),
      total: data.total,
    };
  }

  async item(campaignId: number, sessionId: string): Promise<Session> {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/sessions/${sessionId}`,
    );
    const data = await res.json();
    const entity = this.unserialize(data);

    return entity;
  }

  async create(campaignId: number, data: any) {
    const res = await fetch(`${this.endpoint}/${campaignId}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async update(campaignId: number, sessionId: string, data: any) {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/sessions/${sessionId}`,
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

  async delete(campaignId: number, sessionId: string) {
    await fetch(`${this.endpoint}/${campaignId}/sessions/${sessionId}`, {
      method: "DELETE",
    });
  }

  async count(campaignId: number, filters?: Record<string, string>) {
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
      `${this.endpoint}/${campaignId}/sessions?${queryParams.toString()}`,
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

export default new SessionService();
