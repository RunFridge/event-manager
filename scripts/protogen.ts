import os from "os";
import { exec } from "child_process";

const isWindows = () => os.type() === "Windows_NT";
const protoc = "protoc";
const pluginPath = () =>
  isWindows()
    ? `--plugin=".\\node_modules\\.bin\\protoc-gen-ts_proto.cmd"`
    : "--plugin=./node_modules/.bin/protoc-gen-ts_proto";
const nestOptions = "--ts_proto_opt=nestJs=true";
const grpcMetaOptions = "--ts_proto_opt=addGrpcMetadata=true";
const output = "--ts_proto_out=.";
const files = "./proto/*.proto";

const command = [
  protoc,
  pluginPath(),
  nestOptions,
  grpcMetaOptions,
  output,
  files,
].join(" ");
exec(command, (err) => {
  if (err) throw err;
});
