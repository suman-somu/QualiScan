import logging

class RequestFormatter(logging.Formatter):
    def format(self, record):
        # Add extra context if available
        record.request_method = getattr(record, 'request_method', '-')
        record.request_path = getattr(record, 'request_path', '-')
        record.client_ip = getattr(record, 'client_ip', '-')
        record.module = record.module
        record.funcName = record.funcName
        return super().format(record)

def configure_logging():
    log_format = (
        "%(asctime)s | %(levelname)s | %(module)s.%(funcName)s | "
        "Client: %(client_ip)s | %(request_method)s %(request_path)s | "
        "%(message)s"
    )
    formatter = RequestFormatter(
        fmt=log_format,
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.handlers = []  # Remove any existing handlers
    logger.addHandler(handler)
    logger.propagate = False

    # Example: logger.info("Processing started", extra={"request_method": "POST", "request_path": "/process-ocr/", "client_ip": "127.0.0.1"})
    return logger
