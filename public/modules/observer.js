const createObserver = name => {
  const subscriptions = {};

  const addTopics = (...topics) => {
    topics.forEach(topic => {
      if (!subscriptions[topic]) {
        subscriptions[topic] = [];
      }
    });
  };

  const removeTopics = (...topics) => {
    topics.forEach(topic => {
      if (subscriptions[topic]) {
        delete subscriptions[topic];
      }
    });
  };

  const listTopics = () => Object.keys(subscriptions);

  const isTopic = topic => !!subscriptions[topic];

  const subscribe = ({ topic, observerFunction }) => {
    if (isTopic(topic)) {
      console.log(
        `The function {${observerFunction.name}} has been subscribed to the topic {${topic}} of {${name}}`,
      );
      subscriptions[topic].push(observerFunction);
    } else {
      console.error(
        `The topic { ${topic} } is not an available topic of ${name}`,
      );
    }
  };

  const unsubscribe = ({ topic, functionToRemove }) => {
    const functionsList = subscriptions[topic];
    subscriptions[topic] = functionsList.filter(
      func => func !== functionToRemove,
    );
  };

  const notify = ({ topic, topicData }) => {
    const functionsList = subscriptions[topic];
    console.log(
      `The topic {${topic}} of {${name}} is notifying the data: {${topicData}}`,
    );
    functionsList.forEach(callFunction => callFunction(topicData));
  };

  return {
    name,
    addTopics,
    listTopics,
    subscribe,
    unsubscribe,
    notify,
  };
};

export default createObserver;
