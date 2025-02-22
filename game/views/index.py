#Only be called on front(web)
#后端渲染:生成初始 HTML 文件并发送给浏览器
#后端生成静态 HTML 页面, 只需要提供基础页面结构

from django.shortcuts import render

def index(request):
    return render(request, "multiends/web.html")
