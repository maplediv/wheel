from app import app
from unittest import TestCase

client = app.test_client()

def test_questions():
    resp = client.get("/")
    body = resp.get_data(as_text=True)

    assert resp.status_code == 200
    assert "<autton>" in body

def test_story():
    qs = {"place": "Panama"}
    resp = client.get("/story", query_string=qs)
    body = resp.get_data(as_text=True)

    assert resp.status_code == 200
    assert "in a long-ago Panama" in body 

    
class MadlibsTestCase(TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_questions(self):
        resp = self.client.get("/")
        body = resp.get_data(as_text=True)

        self.assertEqual(resp.status_code, 200)
        self.assertIn("<button>", body)

    def test_story(self):
        qs = {"place": "Panama"}
        resp = self.client.get("/story", query_string=qs)
        body = resp.get_data(as_text=True)

        self.assertEqual(resp.status_code, 200)
        self.assertIn("in a long-ago Panama", body)


