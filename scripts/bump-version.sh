#!/bin/sh
set -e

: "${GITLAB_ACCESS_TOKEN:?Variable GITLAB_ACCESS_TOKEN is required}"
: "${CI_SERVER_HOST:?Variable CI_SERVER_HOST is required}"
: "${CI_PROJECT_PATH:?Variable CI_PROJECT_PATH is required}"

git config user.email "gitlab-ci@dane.gov.pl"
git config user.name "GitLab CI"

if [ -n "${OVERRIDE_VERSION}" ]; then
  RELEASE_VERSION="${OVERRIDE_VERSION}"
  echo "Using OVERRIDE_VERSION=${RELEASE_VERSION}"
else
  RELEASE_VERSION="${CI_COMMIT_BRANCH#release/}"
  echo "Using RELEASE_VERSION from branch=${RELEASE_VERSION}"
fi

if ! echo "${RELEASE_VERSION}" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'; then
  echo "Invalid version format: '${RELEASE_VERSION}' (expected MAJOR.MINOR.PATCH[-suffix])"
  exit 1
fi

CURRENT_VERSION=$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' package.json | head -n 1)
if [ -z "${CURRENT_VERSION}" ]; then
  echo "Could not read .version from package.json"
  exit 1
fi

if [ "${CURRENT_VERSION}" = "${RELEASE_VERSION}" ]; then
  echo "Version already at ${RELEASE_VERSION}, nothing to bump."
  exit 0
fi

git fetch origin
git reset --hard "origin/${CI_COMMIT_BRANCH}"

npm version "${RELEASE_VERSION}" --no-git-tag-version
git add package.json package-lock.json
git commit -m "Zmiana wersji aplikacji na ${RELEASE_VERSION} [skip ci]"
git remote set-url origin "https://oauth2:${GITLAB_ACCESS_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"
git push origin "HEAD:${CI_COMMIT_BRANCH}"
