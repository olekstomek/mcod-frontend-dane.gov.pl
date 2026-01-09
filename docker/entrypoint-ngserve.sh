#!/usr/bin/env sh
# Runs ng serve as configured by
# MCOD_SERVE_CONFIGURATION_ENV - corresponding to values in angular.json, default=local
# MCOD_PROXY_CONFIG_FILE - corresponding to file name with proxy config, default=proxy.local.conf.json
# MCOD_PORT - port to listen on, by default 4000
set -ex

_configuration_env=${MCOD_SERVE_CONFIGURATION_ENV:-local}
_proxy_config=${MCOD_PROXY_CONFIG_FILE:-proxy.local.conf.json}
_port=${MCOD_PORT:-4000}
_ng_bin=./node_modules/.bin/ng

if [ ! -f "${_proxy_config}" ]; then
  echo "FATAL: ${_proxy_config} not found"
  exit 1
fi
exec ${_ng_bin} serve --proxy-config ${_proxy_config} -c ${_configuration_env} --host=0.0.0.0 --port=${_port}
