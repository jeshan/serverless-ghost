#!/usr/bin/env bash
gssg --domain $GHOST_HOME_PAGE --url $STATIC_SITE_HOME_PAGE
live-server static/
