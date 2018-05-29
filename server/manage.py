# -*- coding:utf-8 -*-

from flask_script import Manager

import commands

if __name__ == "__main__":
    from main import app_factory
    import config

    manager = Manager(app_factory)
    manager.add_option("-n", "--name", dest="app_name", required=False, default=config.project_name)
    manager.add_option("-c", "--config", dest="config", required=False, default=config.Dev)
    manager.add_command("test", commands.Test())
    manager.add_command("api", commands.Apps())
    manager.add_command("routes", commands.Routes())

    manager.run()
