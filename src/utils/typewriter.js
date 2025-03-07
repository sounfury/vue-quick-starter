var timer;
function typeWriter(text, text2, textContainer) {
    function typeText(index) {
        if (index < text.length) {
            textContainer.value += text.charAt(index);
            index++;
            timer =  setTimeout(() => {
                typeText(index);
            }, 150);//打字机速度,150ms打一个字
        } else {
            timer =  setTimeout(() => {
                deleteText(text.length);
            }, 1000);//打完字后删除字的停顿时间
        }
    }

    function deleteText(index) {
        if (index >= 0) {
            textContainer.value = text.substring(0, index);
            index--;
            timer =  setTimeout(() => {
                deleteText(index);
            }, 100);//删除速度，100ms删除一个字
        } else {
            timer =  setTimeout(() => {
                typeText2(0);
            }, 1000);//删除完字后打第二段字的停顿时间
        }
    }

    function typeText2(index) {
        if (index < text2.length) {
            textContainer.value += text2.charAt(index);
            index++;
            timer = setTimeout(() => {
                typeText2(index);
            }, 150);
        } 
    }

    typeText(0);
}

export default typeWriter;