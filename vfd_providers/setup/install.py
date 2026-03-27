import frappe
from vfd_providers.patches.custom_fields.vfd_providers_updated_custom_fields import execute

def after_install():
    execute()