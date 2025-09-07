from dotenv import load_dotenv
from langgraph.graph import END, StateGraph, START
from typing import Literal, Annotated
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model
from pydantic import Field, BaseModel
from typing_extensions import TypedDict

load_dotenv()

llm = init_chat_model("gpt-4o-mini")

class State(TypedDict):
    messages: Annotated[list, add_messages]

graph_builder = StateGraph(State)

def chat_bot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

graph_builder.add_node("chat_bot", chat_bot)
graph_builder.add_edge(START, "chat_bot")
graph_builder.add_edge("chat_bot", END)

graph = graph_builder.compile()

user_input = input("Enter your message: ")
state = graph.invoke({"messages": [{"role": "user", "content": user_input}]})

print(state["messages"][-1].content)

