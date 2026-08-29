import { Member } from "../models/member";

class MemberService {
  private endpoint = "/wp-json/wolf-memberships/v1/members";

  async items(options?: {
    filters?: Record<string, string | Record<string, string>>;
    page?: number;
    size?: number;
  }): Promise<{ items: Member[]; total: number }> {
    const { page = 1, size = 20, filters = {} } = options || {};

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: "lastname",
    });

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

    const res = await fetch(`${this.endpoint}?${queryParams.toString()}`);
    const data = await res.json();

    return {
      items: data.items.map((item: any) => this.unserialize(item)),
      total: data.total,
    };
  }

  async item(memberId: string): Promise<Member> {
    const res = await fetch(`${this.endpoint}/${memberId}`);
    const data = await res.json();
    const entity = this.unserialize(data);
    return entity;
  }

  async create(data: any) {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async update(memberId: string, data: any) {
    const res = await fetch(`${this.endpoint}/${memberId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async delete(memberId: string) {
    await fetch(`${this.endpoint}/${memberId}`, {
      method: "DELETE",
    });
  }

  async exists(
    data: {
      firstname: string;
      lastname: string;
      birthdate: string;
    },
    suggestions?: boolean,
    minScore?: number,
  ): Promise<{
    exists: boolean;
    id: number | null;
    suggestions: {
      id: number;
      firstname: string;
      lastname: string;
      birthdate: Date | null;
    }[];
  }> {
    const queryParams = new URLSearchParams();
    queryParams.append("firstname", data.firstname);
    queryParams.append("lastname", data.lastname);
    queryParams.append("birthdate", data.birthdate);
    if (suggestions === true) {
      queryParams.append("suggestions", suggestions.toString());
      if (minScore !== undefined) {
        queryParams.append("score_min", minScore.toString());
      }
    }
    const res = await fetch(
      `${this.endpoint}/exists?${queryParams.toString()}`,
    );
    const resData = await res.json();
    return {
      exists: resData.exists,
      id: resData.id,
      suggestions: resData.suggestions,
    };
  }

  /**
   * Convert a Date object to a UTC timestamp (in seconds) for API compatibility.
   */
  private convertDateToTimestamp(date: Date | null): number | null {
    if (!date) return null;
    return Math.floor(date.getTime() / 1000) - 60;
  }

  private serialize(data: any) {
    return {
      ...data,
      birthdate: this.convertDateToTimestamp(data.birthdate),
    };
  }

  private unserialize(data: any) {
    return {
      ...data,
      birthdate: data.birthdate ? new Date((data.birthdate + 60) * 1000) : null,
    };
  }
}

export default new MemberService();
