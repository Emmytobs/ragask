"""Module for configuring application logging."""

import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
