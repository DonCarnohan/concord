 FROM python:3.6
 ENV PYTHONUNBUFFERED 1
 RUN mkdir /concordium
 WORKDIR /concordium
 ADD requirements.txt /concordium/
 RUN pip install --upgrade pip && pip install -r requirements.txt
 ADD . /concordium/
