using UnityEngine;
using System.Runtime.InteropServices;

public class CharacterManager : MonoBehaviour
{
    // Define a DllImport to send messages to the browser (React)
    [DllImport("__Internal")]
    private static extern void ReactUnitySend(string eventName, string data);

    private Animator animator;

    void Start()
    {
        animator = GetComponent<Animator>();
    }

    // This method is called from React via sendMessage("CharacterManager", "ChangeEmotion", "Happy")
    public void ChangeEmotion(string emotion)
    {
        Debug.Log("Emotion changed to: " + emotion);
        
        if (animator != null)
        {
            // Example: trigger a specific animation state based on emotion
            animator.SetTrigger(emotion);
        }
    }

    // Example: call this when the character is clicked in Unity to notify React
    void OnMouseDown()
    {
        Debug.Log("Character clicked!");
        
        // Ensure this only runs in WebGL builds
        #if UNITY_WEBGL && !UNITY_EDITOR
        ReactUnitySend("OnCharacterClicked", gameObject.name);
        #endif
    }
}
