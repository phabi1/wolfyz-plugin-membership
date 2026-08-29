import { Pay } from "../models/pay";
import { Request } from "../models/request";
import { RequestHistoryItem } from "../models/request-history";

class RequestService {
  private endpoint = "/wp-json/wolf-memberships/v1/campaigns";

  async items(
    campaignId: number,
    options?: {
      filters?: Record<string, string | Record<string, string>>;
      page?: number;
      size?: number;
      sort?: string;
      order?: "asc" | "desc";
    },
  ): Promise<{ items: Request[]; total: number }> {
    const { page = 1, size = 20, sort, order } = options || {};

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    if (sort) {
      queryParams.append("sort", sort);
    }
    if (order) {
      queryParams.append("order", order);
    }
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

  async item(campaignId: number, memberId: number): Promise<Request> {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/requests/${memberId}`,
    );
    const data = await res.json();
    const entity = this.unserialize(data);

    return entity;
  }

  async update(campaignId: number, requestId: number, data: any): Promise<Request> {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/requests/${requestId}`,
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

  async approve(campaignId: number, requestId: number) {
    await fetch(
      `${this.endpoint}/${campaignId}/requests/${requestId}/approve`,
      {
        method: "POST",
      },
    );
  }
  async reject(campaignId: number, requestId: number, reason: string = "") {
    await fetch(`${this.endpoint}/${campaignId}/requests/${requestId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async paid(campaignId: number, requestId: number) {
    await fetch(`${this.endpoint}/${campaignId}/requests/${requestId}/paid`, {
      method: "POST",
    });
  }

  async cancel(campaignId: number, requestId: number) {
    await fetch(`${this.endpoint}/${campaignId}/requests/${requestId}/cancel`, {
      method: "POST",
    });
  }

  async history(
    campaignId: number,
    requestId: number,
  ): Promise<RequestHistoryItem[]> {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/requests/${requestId}/history`,
    );
    const data = await res.json();

    return data.data;
  }

  async calculatePay(campaignId: number, data: any, discount?: number): Promise<Pay> {
    const res = await fetch(
      `/wp-json/wolf-memberships/v1/campaigns/${campaignId}/registration/calculate-total`,
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
          discount,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const responseData = await res.json();

    return responseData;
  }

  public async resendPayment(campaignId: number, requestId: number): Promise<void> {
    await fetch(`${this.endpoint}/${campaignId}/requests/${requestId}/resend-payment`, {
      method: "POST",
    });
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
