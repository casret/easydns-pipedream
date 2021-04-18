const easydns = require('./easydns.app')

module.exports = {
  key: 'easydns-change-ip',
  type: "action",
  name: "Change Ip address",
  description: "Change Ip Address with on easyDNS",
  version: "0.0.16",
  props: {
    easydns,
    domain: {
      propDefinition: [
        easydns,
        "domain"
      ],
      description: "Select domain the record is in",
    },
    record: {
      propDefinition: [
        easydns,
        "record",
        (c) => ({
          domain: c.domain,
          type: "A"
        })
      ],
      description: "Select record to update",
    },
    ip_address: {
      type: "string",
      label: "IP Address",
      description: "New IP Address",
    }
  },
  async run() {
    // fetch the record since we don't want to update anything but the ip address
    const record = await this.easydns.getRecord(this.record)
    if (record["rdata"] == this.ip_address) {
      console.log("No change")
      return "No change"
    }
    const allowed = ["domain", "host", "ttl", "prio", "type", "geozone_id"]
    const new_record = Object.keys(record)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = record[key];
        return obj;
      }, {rdata: this.ip_address});
    await this.easydns.postRecord(record.id, new_record)
    return "Updated"
  }
}
