#!/bin/sh
set -e

: "${GITLAB_ACCESS_TOKEN:?Variable GITLAB_ACCESS_TOKEN is required}"
: "${CI_API_V4_URL:?Variable CI_API_V4_URL is required}"
: "${CI_PROJECT_ID:?Variable CI_PROJECT_ID is required}"
: "${CI_COMMIT_SHA:?Variable CI_COMMIT_SHA is required}"

CURRENT_VERSION=$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' package.json | head -n 1)
if [ -z "${CURRENT_VERSION}" ]; then
  echo "Could not read .version from package.json"
  exit 1
fi
echo "Current version: ${CURRENT_VERSION}"

if [ -n "${RELEASE_VERSION}" ]; then
  echo "Using provided RELEASE_VERSION=${RELEASE_VERSION}"
else
  MAJOR=$(echo "${CURRENT_VERSION}" | cut -d. -f1)
  MINOR=$(echo "${CURRENT_VERSION}" | cut -d. -f2)
  RELEASE_VERSION="${MAJOR}.$((MINOR + 1)).0"
  echo "Computed next minor RELEASE_VERSION=${RELEASE_VERSION}"
fi

if ! echo "${RELEASE_VERSION}" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'; then
  echo "Invalid version format: '${RELEASE_VERSION}' (expected MAJOR.MINOR.PATCH[-suffix])"
  exit 1
fi

BRANCH_NAME="release/${RELEASE_VERSION}"

echo "Checking if branch ${BRANCH_NAME} already exists..."
BRANCH_ENCODED=$(echo "${BRANCH_NAME}" | sed 's|/|%2F|g')
HTTP_CODE=$(curl --silent \
  --header "PRIVATE-TOKEN: ${GITLAB_ACCESS_TOKEN}" \
  --output /dev/null \
  --write-out "%{http_code}" \
  "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/repository/branches/${BRANCH_ENCODED}")
if [ "${HTTP_CODE}" = "200" ]; then
  echo "Branch ${BRANCH_NAME} already exists. Aborting."
  exit 1
fi

echo "Creating branch: ${BRANCH_NAME} from ${CI_COMMIT_SHA}"
BRANCH_PAYLOAD="{\"branch\":\"${BRANCH_NAME}\",\"ref\":\"${CI_COMMIT_SHA}\"}"

curl --fail --silent --show-error \
  --request POST \
  --header "PRIVATE-TOKEN: ${GITLAB_ACCESS_TOKEN}" \
  --header "Content-Type: application/json" \
  --data "${BRANCH_PAYLOAD}" \
  "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/repository/branches"
echo ""
echo "Branch ${BRANCH_NAME} created"

echo "Creating MR: ${BRANCH_NAME} -> master"
MR_MASTER_PAYLOAD="{\"source_branch\":\"${BRANCH_NAME}\",\"target_branch\":\"master\",\"title\":\"Release ${RELEASE_VERSION}\",\"description\":\"Release branch ${RELEASE_VERSION}\"}"

curl --fail --silent --show-error \
  --request POST \
  --header "PRIVATE-TOKEN: ${GITLAB_ACCESS_TOKEN}" \
  --header "Content-Type: application/json" \
  --data "${MR_MASTER_PAYLOAD}" \
  "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests"
echo ""
echo "MR ${BRANCH_NAME} -> master created"

echo "Creating MR: ${BRANCH_NAME} -> develop"
MR_DEVELOP_PAYLOAD="{\"source_branch\":\"${BRANCH_NAME}\",\"target_branch\":\"develop\",\"title\":\"Release ${RELEASE_VERSION} -> develop\",\"description\":\"Merge release ${RELEASE_VERSION} back into develop\"}"

curl --fail --silent --show-error \
  --request POST \
  --header "PRIVATE-TOKEN: ${GITLAB_ACCESS_TOKEN}" \
  --header "Content-Type: application/json" \
  --data "${MR_DEVELOP_PAYLOAD}" \
  "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests"
echo ""
echo "MR ${BRANCH_NAME} -> develop created"
