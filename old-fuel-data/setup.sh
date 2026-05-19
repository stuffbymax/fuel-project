#!/usr/bin/env bash
# name: setup.sh
# description: Sets up a twice-daily cron job (11am + 5pm) that downloads
#              the latest fuel prices and runs the pipeline.
# author: MartinP
# usage: chmod +x setup.sh && ./setup.sh

set -euo pipefail

# ---------------------------------------------------------------------------
# Config — adjust PROJECT_DIR to your actual project path
# ---------------------------------------------------------------------------
PROJECT_DIR="${1:-$(pwd)}"
PYTHON="${2:-python3}"
LOG_DIR="$PROJECT_DIR/logs"

mkdir -p "$LOG_DIR"

# The cron line: runs at after 11:00 and 17:00 every day
CRON_JOB="0 11,17 * * * cd $PROJECT_DIR && ./update.sh && $PYTHON pipeline.py >> $LOG_DIR/pipeline.log 2>&1"

# Add only if not already present
if crontab -l 2>/dev/null | grep -qF "pipeline.py"; then
    echo "Cron job already exists — skipping."
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "Cron job added:"
    echo "  $CRON_JOB"
fi

echo ""
echo "Done! Pipeline will run at 11:00 and 17:00 every day."
echo "Logs: $LOG_DIR/pipeline.log"
echo ""
echo "To check your crontab:  crontab -l"
echo "To remove the job:      crontab -e  (then delete the line)"