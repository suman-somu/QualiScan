from datetime import datetime

def is_date_expired(date_str):
  """
  Checks if a given date string has passed today's date.

  Args:
    date_str: The date string in the format YYYY-MM-DD.

  Returns:
    True if the date has passed, False otherwise.
  """

  try:
    # Parse the input date string
    input_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    
    # Get today's date
    today = datetime.now().date()

    # Compare the dates
    return input_date < today

  except ValueError:
    print("Invalid date format. Please use YYYY-MM-DD.")
    return None