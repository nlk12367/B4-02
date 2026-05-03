mergeInto(LibraryManager.library, {
  ReactUnitySend: function (eventName, data) {
    // Converts the string pointers from Unity into JavaScript strings
    var eventNameStr = UTF8ToString(eventName);
    var dataStr = UTF8ToString(data);
    
    // Dispatch a custom event to the global window object.
    // React-unity-webgl's addEventListener listens for this.
    try {
      window.dispatchReactUnityEvent(eventNameStr, dataStr);
    } catch (e) {
      console.warn("React is not listening to this event or dispatchReactUnityEvent is not available.");
    }
  },
});
