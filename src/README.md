"""
Analytics Worker
---------------

A Python worker application for handling analytics tasks.

Usage
-----

To run the worker, execute the following command:

    python -m analytics_worker

Configuration
-------------

The worker can be configured using environment variables. The following
variables are supported:

*   `ANALYTICS_API_KEY`: The API key for the analytics service.
*   `ANALYTICS_API_URL`: The URL of the analytics API.
*   `WORKER_QUEUE`: The queue name for the worker to process tasks from.

Logging
-------

The worker logs messages using the Python `logging` module. The log level
can be set using the `ANALYTICS_LOG_LEVEL` environment variable.

Example
-------

To run the worker with the API key and API URL set from environment variables,
use the following command:

    ANALYTICS_API_KEY=YOUR_API_KEY ANALYTICS_API_URL=YOUR_API_URL python -m analytics_worker
"""

import os
import logging
import sys

# Set up logging
logging.basicConfig(level=os.environ.get('ANALYTICS_LOG_LEVEL', 'INFO'))

# Set up API key and URL from environment variables
api_key = os.environ.get('ANALYTICS_API_KEY')
api_url = os.environ.get('ANALYTICS_API_URL')

# Check if API key and URL are set
if not api_key or not api_url:
    print("Error: ANALYTICS_API_KEY and ANALYTICS_API_URL must be set.")
    sys.exit(1)

# Import the worker module
import analytics_worker

# Run the worker
analytics_worker.run(api_key, api_url)