"""
analytics-worker - A high-performance analytics worker that aggregates and processes data from various sources.

Requirements
------------

* python >= 3.8
* pandas
* numpy
* requests
* sqlite3

Installation
------------

To install the required dependencies, run:

```bash
pip install -r requirements.txt
```

Usage
-----

To run the worker, simply execute the script:

```bash
python analytics_worker.py
```

Configuration
------------

The worker can be configured using a TOML configuration file. Create a file named `.env` in the project root with the following format:

```
[Analytics]
  api_key = "YOUR_API_KEY"
  database = "analytics.db"

[Sources]
  source1 = "source1_url"
  source2 = "source2_url"
```

Replace `YOUR_API_KEY` with your actual API key and `source1_url` and `source2_url` with the URLs of your data sources.

License
-------

MIT License

Copyright (c) [Year] [Author]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

import os
import toml
import pandas as pd
import numpy as np
import requests
import sqlite3

def load_config():
    """Load configuration from .env file"""
    config_file = os.environ.get('CONFIG_FILE', '.env')
    config = toml.load(config_file)
    return config

def create_database(conn):
    """Create the database schema"""
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS data
        (id INTEGER PRIMARY KEY, 
         timestamp TEXT, 
         source TEXT, 
         value REAL)
    ''')
    conn.commit()

def fetch_data(config):
    """Fetch data from configured sources"""
    data = []
    for source in config['Sources']:
        response = requests.get(config['Sources'][source])
        data.extend(json.loads(response.content))
    return data

def process_data(data):
    """Aggregate and process the fetched data"""
    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)
    aggregated_data = df.groupby('source').mean()
    return aggregated_data

def save_data(conn, data):
    """Save the processed data to the database"""
    c = conn.cursor()
    for index, row in data.iterrows():
        c.execute("INSERT INTO data (timestamp, source, value) VALUES (?, ?, ?)", 
                  (row.name, index, row['value']))
    conn.commit()

def main():
    config = load_config()
    conn = sqlite3.connect(config['Analytics']['database'])
    create_database(conn)
    data = fetch_data(config)
    processed_data = process_data(data)
    save_data(conn, processed_data)

if __name__ == '__main__':
    main()