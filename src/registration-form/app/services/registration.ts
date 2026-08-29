class RegistrationService {
  getRegistration(campaignId: string, requestId?: string, token?: string) {
    let url = `/wp-json/wolf-memberships/v1/campaigns/${campaignId}/registration`;
    if (requestId && token) {
      url += `?request_id=${requestId}&token=${token}`;
    }

    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error("An error occurred while loading the registration.");
      }
      return response.json();
    });
  }

  register(campaignId: string, payload: any) {
    return fetch(
      `/wp-json/wolf-memberships/v1/campaigns/${campaignId}/registration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    ).then((response) => {
      if (!response.ok) {
        throw new Error("An error occurred while registering.");
      }
      return response.json();
    });
  }

  calculateTotal(campaignId: string, payload: any) {
    return fetch(
      `/wp-json/wolf-memberships/v1/campaigns/${campaignId}/registration/calculate-total`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    ).then((response) => {
      if (!response.ok) {
        throw new Error("An error occurred while calculating the total.");
      }
      return response.json();
    });
  }
}

export default new RegistrationService();
