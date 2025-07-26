from setuptools import setup, find_packages

setup(
    name="smartfarm_backend",
    version="0.1.0",
    packages=[
        "backend",
        "education",
        "education_resources",
        "equipment",
        "marketplace",
        "media",
        "orders",
        "transport",
        "users",
        "weather",
    ],
    include_package_data=True,
    install_requires=[
        "Django>=4.2",
        "djangorestframework",
        # Add any other required packages here
    ],
)
