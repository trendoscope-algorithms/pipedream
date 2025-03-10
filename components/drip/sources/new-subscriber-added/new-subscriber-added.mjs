import base from "../common/base.mjs";

export default {
  ...base,
  key: "drip-new-subscriber-added",
  name: "New Subscriber Added (Instant)",
  description: "Emit new event when a new subscriber is created",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  props: {
    ...base.props,
    campaign: {
      propDefinition: [
        base.props.drip,
        "campaign",
      ],
      description: "Email campaign to filter",
      withLabel: true,
      optional: true,
    },
  },
  methods: {
    ...base.methods,
    getEventType() {
      return "subscriber.created";
    },
    getSummary({
      subscriber: {
        email, first_name, last_name,
      },
    }) {
      let string = `New Subscriber: ${email}`;
      if (first_name) string += ` - ${first_name} ${last_name}`;
      return string;
    },
  },
  async run({ body }) {
    if (this.campaign) {
      const { subscribers } = await this.drip.listSubscribersInCampaign({
        campaign: this.campaign.value,
      });
      const email = body.data.subscriber.email;
      if (!subscribers.find((subscriber) => subscriber.email === email)) {
        console.log(`${email} not in ${this.campaign.label} campaign. Skipping...`);
        return;
      }
    }

    await this.emitEvent(body);
  },
};
