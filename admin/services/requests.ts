import { Pay } from "../models/pay";
import { Request } from "../models/request";
import { RequestHistoryItem } from "../models/request-history";

class RequestService {
  private endpoint = "/wp-json/wolf-memberships/v1/campaigns";

  async items(
    campaignId: string,
    options?: {
      filters?: Record<string, string | Record<string, string>>;
      page?: number;
      size?: number;
    },
  ): Promise<{ items: Request[]; total: number }> {
    const { page = 1, size = 20 } = options || {};

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    if (options?.filters) {
      let filters: string[] = [];
      Object.entries(options.filters).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([operator, subValue]) => {
            filters.push(`${key}:${operator}:${subValue}`);
          });
        } else if (value !== "") {
          filters.push(`${key}:like:${value}`);
        }
      });
      queryParams.append("filters", filters.join(";"));
    }

    const res = await fetch(
      `${this.endpoint}/${campaignId}/requests?${queryParams.toString()}`,
    );
    const data = await res.json();

    return {
      items: data.items.map((item: any) => this.unserialize(item)),
      total: data.total,
    };
  }

  async item(campaignId: string, memberId: string): Promise<Request> {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/requests/${memberId}`,
    );
    const data = await res.json();
    const entity = this.unserialize(data);

    return entity;
  }

  async approve(campaignId: string, requestId: string) {
    await fetch(
      `${this.endpoint}/${campaignId}/requests/${requestId}/approve`,
      {
        method: "POST",
      },
    );
  }
  async reject(campaignId: string, requestId: string, reason: string = "") {
    await fetch(`${this.endpoint}/${campaignId}/requests/${requestId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async paid(campaignId: string, requestId: string) {
    await fetch(`${this.endpoint}/${campaignId}/requests/${requestId}/paid`, {
      method: "POST",
    });
  }

  async cancel(campaignId: string, requestId: string) {
    await fetch(`${this.endpoint}/${campaignId}/requests/${requestId}/cancel`, {
      method: "POST",
    });
  }

  async history(
    campaignId: string,
    requestId: string,
  ): Promise<RequestHistoryItem[]> {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/requests/${requestId}/history`,
    );
    const data = await res.json();

    return data.data;
  }

  async calculatePay(campaignId: string, data: any): Promise<Pay> {
    const res = await fetch(
      `/wp-json/wolf-memberships/v1/campaigns/${campaignId}/registration/calculate-total`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const responseData = await res.json();

    return responseData;
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

export default new RequestService();
