import cv2
import torch
import urllib.request
import numpy as np
import matplotlib.pyplot as plt
from roboflow import Roboflow


import sys
import torchvision
import torch
from torchvision import transforms
from PIL import Image
import cv2
import random


def estimate_volume_in_cubic_meters(x1, x2, y1, y2, depth_meter):
    """
    Estimate the volume of a rectangular prism within a bounding box.

    Parameters:
    - x1, x2, y1, y2: Bounding box coordinates in pixels
    - depth_meter: Depth of the object in meters

    Returns:
    - volume_cubic_meter: Estimated volume in cubic meters
    """
    area_of_base_pixel2 = (x2 - x1) * (y2 - y1)


    area_of_base_meter2 = area_of_base_pixel2 * (depth_meter / (y2 - y1))  # Assuming y2 represents the height of the object

    volume_cubic_meter = area_of_base_meter2 * depth_meter

    return volume_cubic_meter* 0.0264* 0.0264

def calculating_depth2(image_path):
    
    #url, filename = ("https://github.com/pytorch/hub/raw/master/images/dog.jpg", "dog.jpg")
    #urllib.request.urlretrieve(url, filename)

    #model_type = "DPT_Large"  
    model_type = "DPT_Hybrid"   
    #model_type = "MiDaS_small"  
    

    midas = torch.hub.load("intel-isl/MiDaS", model_type)

    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    midas.to(device)
    midas.eval()

    midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")

    if model_type == "DPT_Large" or model_type == "DPT_Hybrid":
        transform = midas_transforms.dpt_transform
    else:
        transform = midas_transforms.small_transform

    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    input_batch = transform(img).to(device)

    with torch.no_grad():
        prediction = midas(input_batch)

        # Reverse the order of the image shape for interpolation
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size=(img.shape[1], img.shape[0]),
            mode="bicubic",
            align_corners=False,
        ).squeeze()
    
    output = prediction.cpu().numpy() / 1000.0
    depth_values = prediction.cpu().numpy() / 1000.0

    # Print the maximum depth value
    max_depth = np.max(depth_values)
    #print("Maximum Depth:", max_depth)

    # Display the depth map
    #plt.imshow(output, cmap="viridis")
    #plt.colorbar()
    #plt.show()

    # ---------->> depth is in centimeter <<--------------
    return max_depth


def calculating_depth(image_path, x, y):
    x = (int)(x)
    y = (int)(y)
    #url, filename = ("https://github.com/pytorch/hub/raw/master/images/dog.jpg", "dog.jpg")
    #urllib.request.urlretrieve(url, filename)

    #model_type = "DPT_Large" 
    model_type = "DPT_Hybrid"  
    #model_type = "MiDaS_small" 
    

    midas = torch.hub.load("intel-isl/MiDaS", model_type)

    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    midas.to(device)
    midas.eval()

    midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")

    if model_type == "DPT_Large" or model_type == "DPT_Hybrid":
        transform = midas_transforms.dpt_transform
    else:
        transform = midas_transforms.small_transform

    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    input_batch = transform(img).to(device)

    with torch.no_grad():
        prediction = midas(input_batch)

        # Reverse the order of the image shape for interpolation
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size=(img.shape[1], img.shape[0]),
            mode="bicubic",
            align_corners=False,
        ).squeeze()
    
    output = prediction.cpu().numpy() / 1000.0
    depth_values = prediction.cpu().numpy() / 1000.0

    # Print the maximum depth value
    max_depth = float(depth_values[x][y] * 1.00)
    #print("Maximum Depth:", max_depth)

    # Display the depth map
    #plt.imshow(output, cmap="viridis")
    #plt.colorbar()
    #plt.show()

    # ---------->> depth is in centimeter <<--------------
    return max_depth

# Example usage:
#image_path = "/Users/suyash9698/desktop/Fruit_Vegetable_Recognition/train/apple/Image_1.jpg"
#calculating_depth(image_path)

def show_image2():
    if len(sys.argv) != 2:
        print("Usage: python script.py <input_image_path>")
        sys.exit(1)

    input_image_path = sys.argv[1]
    

    # rf = Roboflow(api_key="ZSIWCENFR3fp7RI4NOGH")
    # project = rf.workspace().project("ssd-project-weigh-my-plate")
    # model = project.version(2).model

    rf = Roboflow(api_key="mw7byBXvldbsEFeuM5A7")
    project = rf.workspace().project("weigh-my-plate-z3iuy")
    model = project.version(1).model

    # infer on a local image

    d = model.predict(input_image_path, confidence=35, overlap=70).json()

    
    # visualize your prediction
    model.predict(input_image_path, confidence=35, overlap=70).save("/Users/suyash9698/desktop/2023202017today/client/src/output.jpeg")
    result_image_path = f"/Users/suyash9698/desktop/2023202017today/client/src/output.jpeg"
   
    s = ""
    s+=result_image_path+" "
    for item in d["predictions"]:
        x_cordinate = int(item["x"])
        y_cordinate = int(item["y"])
        height = float(item["height"])
        width = float(item["width"])
        new_x = x_cordinate 
        new_y = y_cordinate 
        depth = calculating_depth(input_image_path, new_x, new_y)
        area = width * height * 0.0264 * 0.0264 * depth
        classname = item['class']
        s+=classname+","+str(area)+" "

    return s

    # infer on an image hosted elsewhere
    # print(model.predict("URL_OF_YOUR_IMAGE", hosted=True, confidence=40, overlap=30).json())

def show_image():
    #print("ok")
    if len(sys.argv) != 2:
        print("Usage: python script.py <input_image_path>")
        sys.exit(1)

    input_image_path = f"/Users/suyash9698/desktop/2023202017today/client/src/output.jpeg"

    model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
    model.eval()
    ig = Image.open(input_image_path)
    transform = transforms.ToTensor()
    img = transform(ig)

    with torch.no_grad():
        pred = model([img])

    pred[0]['boxes'].sort()
    bboxes, labels, scores = pred[0]["boxes"], pred[0]["labels"], pred[0]["scores"]
    num = torch.argwhere(scores > 0.904).shape[0]
    font = cv2.FONT_HERSHEY_SIMPLEX
    igg = cv2.imread(input_image_path)

    # Increase the border thickness to 3 (you can adjust it as needed)
    border_thickness = 1

    coco_names = ["person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light", "fire hydrant", "street sign", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "hat", "backpack", "umbrella", "shoe", "eye glasses", "handbag", "tie", "suitcase",
                 "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat",
                 "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle",
                 "plate", "wine glass", "cup", "fork", "knife", "spoon", "bowl",
                 "banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog",
                 "pizza", "donut", "cake", "chair", "couch", "potted plant", "bed",
                 "mirror", "dining table", "window", "desk", "toilet", "door", "tv",
                 "laptop", "mouse", "remote", "keyboard", "cell phone", "microwave",
                 "oven", "toaster", "sink", "refrigerator", "blender", "book",
                 "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush", "hair brush"]
    
    label_names=[]
    for i in range(num):
        x1, y1, x2, y2 = bboxes[i].numpy().astype("int")
        class_name = coco_names[labels.numpy()[i] - 1]
        box_area=estimate_volume_in_cubic_meters(x1,x2,y1,y2,calculating_depth2(input_image_path))
        #print("box area ",box_area)  
        label_names.append(class_name)
        label_names.append(box_area * 100)
        font_size = 0.8
        igg = cv2.rectangle(igg, (x1, y1), (x2, y2), (0, 255, 0), border_thickness)
        igg = cv2.putText(igg, class_name, (x1, y1 - 10), font, font_size, (255, 0, 0), border_thickness, cv2.LINE_AA)

    random_number = random.randint(1, 100)  
    result_image_path = f"/Users/suyash9698/desktop/2023202017today/client/src/output.jpeg"
  
    cv2.imwrite(result_image_path, igg)
    label_names.insert(0,result_image_path)
    return label_names

if __name__ == "__main__":
    s2=show_image2()
    modified_image_path = show_image()
    
    s1=""
    
    for i in range(1,len(modified_image_path),2):
        s1+=modified_image_path[i]+","+str(modified_image_path[i+1])+" "
    #old result
    
    

    s=s2+s1

    print(s)



