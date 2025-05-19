import concurrently from "concurrently";

const services = ["gateway", "auth", "event"];
const prefixColors = ["green", "blue", "magenta"];

concurrently(
  services.map((service, i) => ({
    name: service.toUpperCase(),
    command: `nest start ${service} --watch`,
    prefixColor: prefixColors[i],
  })),
  { prefixColors, padPrefix: true },
);
