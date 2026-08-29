import { convertDateToTimestamp, convertTimestampToDate } from "../utils";
import type { Campaign } from "../models/campaign";

class CampaignService {
  private endpoint = "/wp-json/wolf-memberships/v1/campaigns";

  async items() {
    const res = await fetch(this.endpoint);
    const items = await res.json();
    return items.map(this.deserialize);
  }

  async item(campaignId: string): Promise<Campaign> {
    const res = await fetch(`${this.endpoint}/${campaignId}`);
    return this.deserialize(await res.json());
  }

  async update(
    campaignId: string,
    data: {
      title?: string;
      registration_start?: Date | null;
      registration_end?: Date | null;
    },
  ): Promise<Campaign> {
    const payload = this.serialize(data);
    const res = await fetch(`${this.endpoint}/${campaignId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return this.deserialize(await res.json());
  }

  async updateSettings(campaignId: string, settings: Record<string, unknown>) {
    const res = await fetch(`${this.endpoint}/${campaignId}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
    return res.json();
  }

  async currentWheels(
    campaignId: number,
  ): Promise<{
    items: { wheel_id: number; wheel_title: string; count: number }[];
  }> {
    const res = await fetch(`${this.endpoint}/${campaignId}/current-wheels`);
    return await res.json();
  }

  async nextWheels(campaignId: number): Promise<{
    items: {
      wheel_id: number;
      wheel_title: string;
      member_id: number;
      firstname: string;
      lastname: string;
    }[];
  }> {
    const res = await fetch(`${this.endpoint}/${campaignId}/next-wheels`);
    return await res.json();
  }

  private serialize(data: Record<string, unknown>): Record<string, unknown> {
    return {
      ...data,
      registration_start: data.registration_start
        ? convertDateToTimestamp(data.registration_start as Date)
        : null,
      registration_end: data.registration_end
        ? convertDateToTimestamp(data.registration_end as Date)
        : null,
    };
  }

  private deserialize(data: Record<string, unknown>): Campaign {
    return {
      ...data,
      registration_start: data.registration_start
        ? convertTimestampToDate(data.registration_start as number)
        : null,
      registration_end: data.registration_end
        ? convertTimestampToDate(data.registration_end as number)
        : null,
    } as Campaign;
  }
}

export default new CampaignService();
