# -*- config:utf-8 -*-

import logging
from datetime import timedelta

project_name = "server"


# base config class; extend it to your needs.
class Config(object):
    # use DEBUG mode?
    DEBUG = True

    # use TESTING mode?
    TESTING = False

    # use server x-sendfile?
    USE_X_SENDFILE = False
    WTF_CSRF_ENABLED = True
    SECRET_KEY = "secret"  # import os; os.urandom(24)

    # LOGGING
    LOGGER_NAME = "%s_log" % project_name
    LOG_FILENAME = "/var/tmp/app.%s.log" % project_name
    LOG_LEVEL = logging.INFO
    LOG_FORMAT = "%(asctime)s %(levelname)s\t: %(message)s" # used by logging.Formatter

    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

    # EMAIL CONFIGURATION
    MAIL_SERVER = "localhost"
    MAIL_PORT = 25
    MAIL_USE_TLS = False
    MAIL_USE_SSL = False
    MAIL_DEBUG = False
    MAIL_USERNAME = None
    MAIL_PASSWORD = None
    DEFAULT_MAIL_SENDER = "example@%s.com" % project_name

    LOAD_MODULES_EXTENSIONS = ['views', 'models']

    UPLOAD_FOLDER = '/tmp'

    EXTENSIONS = [
        
        'extensions.toolbar',
    ]

    # see example/ for reference
    # ex: BLUEPRINTS = ['blog']  # where `blog` is a Blueprint instance
    # ex: BLUEPRINTS = [('blog', {'url_prefix': '/myblog'})]  # where `blog` is a Blueprint instance
    BLUEPRINTS = ['api']


# config class for development environment
class Dev(Config):
    DEBUG = True  # we want debug level output
    MAIL_DEBUG = True
    SQLALCHEMY_ECHO = True  # we want to see sqlalchemy output
    SQLALCHEMY_DATABASE_URI = "sqlite:////var/tmp/%s_dev.sqlite" % project_name


# config class used during tests
class Test(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = "sqlite:////tmp/%s_test.sqlite" % project_name
