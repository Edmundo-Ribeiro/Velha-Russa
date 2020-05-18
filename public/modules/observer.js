const createObserver = (name) => {
  const subscriptions = {};

  const addTopics = (...topics) => {
    topics.forEach( (topic) => {
      if( ! subscriptions[topic] ) {
        subscriptions[topic] = []
      }
    });
  }

  const removeTopics = (...topics) => {
    topics.forEach( (topic) => {
      if( subscriptions[topic] ) {
        delete subscriptions[topic];
      }
    });
  }

  const listTopics = () => {
    return Object.keys(subscriptions);
  }

  const isTopic = (topic) => {
    return !!subscriptions[topic] ;
  }

  const subscribe = ({topic, observerFunction}) => {
    if (isTopic) {
      subscriptions[topic].push(observerFunction);
    }
    else {
      console.log(`${topic} is not an avaliable topic of ${name}`)
    }
  }

  const unsubscribe = ({ topic, functionToRemove }) => {
    const functionsList = subscriptions[topic];
    subscriptions[topic] = functionsList.filter(func => func !== functionToRemove);
  }

  const notify = ({topic, topicData}) => {
    const functionsList = subscriptions[topic];
    functionsList.forEach(callFunction => callFunction(topicData));
  }

  return {
    name,
    addTopics,
    listTopics,
    subscribe, 
    unsubscribe, 
    notify
  };
}

export default createObserver;