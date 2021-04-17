const axios = require("axios");

module.exports = {
  type: "app",
  app: "easydns",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      async options() {
        const user = await this.getUser()
        const domains = await this.getDomains(user.user)
        return Object.values(domains).filter((d) => typeof d === "object").map((d) => d.name)
      }
    },
    record: {
      type: "string",
      label: "A Records",
      async options({ domain, type }) {
        return (await this.getRecords(domain)).filter((r) => r.type == type).map((r) => ({
          label: r.host,
          value: r.id}))
      }
    },
  },
  methods: {
    axios() {
      return axios.create({
        baseURL: "https://rest.easydns.net/",
        headers: {
          "Accept": `application/json`,
        },
        auth: {
          username: `${this.$auth.Token}`,
          password: `${this.$auth.Key}`,
        },
      })
    },
    async getUser() {
      return (await this.axios().get(`/user`)).data.data
    },
    async getDomains(user) {
      return (await this.axios().get(`/domains/list/${user}`)).data.data
    },
    async getRecords(domain) {
      return (await this.axios().get(`/zones/records/all/${domain}`)).data.data
    },
    async getRecord(id) {
      return (await this.axios().get(`/zones/records/${id}`)).data.data
    },
    async postRecord(id, record) {
      return (await this.axios().post(`/zones/records/${id}`, record)).data.data
    },
  },
};
