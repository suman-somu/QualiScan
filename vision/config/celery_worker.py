from celery import Celery

celery_app = Celery(
    "vision",
    broker="redis://redis:6379/0",  # or your Redis/RabbitMQ URL
    backend="redis://redis:6379/0"
)

# Include tasks modules
celery_app.conf.imports = ["vision.tasks.process_ocr_task"]
