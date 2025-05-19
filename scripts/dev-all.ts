import concurrently from "concurrently";

const services = ["gateway", "auth", "event"];
const prefixColors = ["green", "blue", "magenta"];

concurrently(
  services.map((service, i) => ({
    name: service,
    command: `nest start ${service} --watch`,
    prefixColor: prefixColors[i],
  })),
  { prefixColors, padPrefix: true },
);
