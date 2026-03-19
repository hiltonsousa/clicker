
from pynput import mouse


def grab_coordinates2():
    def on_click(x, y, button, pressed):
        if pressed and button == mouse.Button.right:
            x, y = int(x), int(y)
            print(f"Clicked at: x={x}, y={y}")

    print("Click the desired points...")

    with mouse.Listener(on_click=on_click) as listener:
        listener.join()


if __name__ == "__main__":
    grab_coordinates2()


    