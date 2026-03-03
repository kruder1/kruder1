#!/bin/bash
# ============================================================
# KRUDER 1 — Deploy Script
# Deploys Pages sites and Workers to Cloudflare
#
# Usage:
#   ./deploy.sh              Deploy everything
#   ./deploy.sh landing      Deploy landing (Pages + Worker)
#   ./deploy.sh admin        Deploy admin (Pages + Worker)
#   ./deploy.sh workers      Deploy all 4 workers only
#   ./deploy.sh pages        Deploy both Pages sites only
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PAGES_DIR="$SCRIPT_DIR"
WORKERS_DIR="$SCRIPT_DIR/workers"

# Production branch for Cloudflare Pages (both projects use 'main')
PAGES_BRANCH="main"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
info() { echo -e "  ${YELLOW}→${NC} $1"; }

deploy_pages_landing() {
    echo ""
    echo "── Landing Pages (kruder1.com, kruder.uno, kruder.one) ──"
    info "Deploying kruder1-landing..."
    if npx wrangler pages deploy "$PAGES_DIR/kruder1-landing" \
        --project-name=kruder1-landing \
        --branch="$PAGES_BRANCH" \
        --commit-dirty=true 2>&1 | tail -3; then
        ok "Landing Pages deployed"
    else
        fail "Landing Pages failed"
        return 1
    fi
}

deploy_pages_admin() {
    echo ""
    echo "── Admin Pages (admin.kruder1.com) ──"
    info "Deploying kruder1-admin..."
    if npx wrangler pages deploy "$PAGES_DIR/kruder1-admin" \
        --project-name=kruder1-admin \
        --branch="$PAGES_BRANCH" \
        --commit-dirty=true 2>&1 | tail -3; then
        ok "Admin Pages deployed"
    else
        fail "Admin Pages failed"
        return 1
    fi
}

deploy_worker() {
    local name=$1
    local config="wrangler-${name}.toml"
    info "Deploying worker: $name..."
    if (cd "$WORKERS_DIR" && npx wrangler deploy -c "$config" 2>&1 | tail -3); then
        ok "Worker $name deployed"
    else
        fail "Worker $name failed"
        return 1
    fi
}

deploy_all_workers() {
    echo ""
    echo "── Workers ──"
    deploy_worker "landing"
    deploy_worker "auth"
    deploy_worker "gen"
    deploy_worker "admin"
}

deploy_all() {
    echo "============================================"
    echo "  KRUDER 1 — Full Deploy"
    echo "============================================"
    deploy_pages_landing
    deploy_pages_admin
    deploy_all_workers
    echo ""
    echo -e "${GREEN}Done!${NC}"
    echo ""
}

# ── Main ──
case "${1:-all}" in
    all)
        deploy_all
        ;;
    landing)
        echo "── Deploying Landing ──"
        deploy_pages_landing
        deploy_worker "landing"
        echo -e "\n${GREEN}Done!${NC}"
        ;;
    admin)
        echo "── Deploying Admin ──"
        deploy_pages_admin
        deploy_worker "admin"
        echo -e "\n${GREEN}Done!${NC}"
        ;;
    workers)
        deploy_all_workers
        echo -e "\n${GREEN}Done!${NC}"
        ;;
    pages)
        echo "── Deploying all Pages ──"
        deploy_pages_landing
        deploy_pages_admin
        echo -e "\n${GREEN}Done!${NC}"
        ;;
    *)
        echo "Usage: ./deploy.sh [all|landing|admin|workers|pages]"
        exit 1
        ;;
esac
