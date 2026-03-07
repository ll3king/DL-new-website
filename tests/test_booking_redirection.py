import unittest
from unittest.mock import MagicMock, patch
import os
import sys

# Add project root to path
sys.path.append(os.getcwd())

from gemini_brain import GeminiBrain
from sheets_tool import SheetsTool

class TestBookingRedirection(unittest.TestCase):
    def setUp(self):
        self.mock_sheets = MagicMock(spec=SheetsTool)
        self.brain = GeminiBrain(self.mock_sheets)

    def test_group_size_greater_than_6_under_11(self):
        """Case: 6 < group_size <= 10. Should return guidance for walk-in and NOT create logic."""
        # Current code returns FAILED for > 6. We want it to handle it gracefully for walk-in.
        result = self.brain.manage_booking(action='create', name='Test', contact='123', date='2024-01-01', group_size=7)
        self.assertIn("WALK_IN_RECOMMENDED", result)
        self.mock_sheets.sync_to_sheets.assert_not_called()

    def test_group_size_greater_than_10(self):
        """Case: group_size > 10. Should trigger Manual_Review and notify manager."""
        result = self.brain.manage_booking(action='create', name='Test', contact='123', date='2024-01-01', group_size=12)
        self.assertIn("MANUAL_REVIEW_TRIGGERED", result)
        
        # Verify it was synced with the correct status
        args, kwargs = self.mock_sheets.sync_to_sheets.call_args
        self.assertEqual(args[0]['status'], 'Manual_Review')
        self.assertIn("SYSTEM ALERT", args[0]['notes'])

if __name__ == '__main__':
    unittest.main()
