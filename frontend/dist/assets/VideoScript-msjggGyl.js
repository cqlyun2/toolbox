import{o as i,c as u,a as e,f as c,x as d,z as n,t as m,b as w,d as b,E as g}from"./index-DO37WybI.js";const f={class:"grid grid-cols-1 lg:grid-cols-2 gap-6"},y={class:"space-y-4"},k=["disabled"],h={class:"min-h-[400px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"},V={key:0,class:"whitespace-pre-wrap text-sm font-serif"},U={key:1,class:"h-full flex items-center justify-center text-gray-400"},$={key:0,class:"mt-4 flex gap-3"},E={__name:"VideoScript",setup(B){const l=b({title:"",open:"",main:"",ending:"",subtitle:""}),r=b(!1),o=b(""),p=()=>{if(!l.value.title){g.warning("请输入视频标题");return}r.value=!0,setTimeout(()=>{const s=l.value;o.value=`${s.title}

【开场】
${s.open||"镜头缓缓拉近，画面渐入"}

【主体】
${s.main||"活动现场拍摄，展示精彩瞬间"}

【结尾】
${s.ending||"合影留念，镜头慢慢拉远"}

【字幕】
${s.subtitle||"劳动最光荣"}

【时长建议】
总时长：60-90秒

【配乐建议】
轻快、积极的背景音乐`,r.value=!1,g.success("生成成功！")},500)},x=()=>{navigator.clipboard.writeText(o.value),g.success("已复制")},v=()=>{const s=document.createElement("a");s.href=URL.createObjectURL(new Blob([o.value])),s.download=`${l.value.title}.txt`,s.click()};return(s,t)=>(i(),u("div",f,[e("div",null,[t[10]||(t[10]=e("h3",{class:"font-medium text-gray-900 dark:text-white mb-4"},"填写信息",-1)),e("div",y,[e("div",null,[t[5]||(t[5]=e("label",{class:"block text-sm font-medium mb-1"},[c("视频标题 "),e("span",{class:"text-red-500"},"*")],-1)),d(e("input",{"onUpdate:modelValue":t[0]||(t[0]=a=>l.value.title=a),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"例如：工会活动纪实"},null,512),[[n,l.value.title]])]),e("div",null,[t[6]||(t[6]=e("label",{class:"block text-sm font-medium mb-1"},"开场画面",-1)),d(e("textarea",{"onUpdate:modelValue":t[1]||(t[1]=a=>l.value.open=a),rows:"2",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"镜头缓缓拉近..."},null,512),[[n,l.value.open]])]),e("div",null,[t[7]||(t[7]=e("label",{class:"block text-sm font-medium mb-1"},"主体内容",-1)),d(e("textarea",{"onUpdate:modelValue":t[2]||(t[2]=a=>l.value.main=a),rows:"4",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"活动现场..."},null,512),[[n,l.value.main]])]),e("div",null,[t[8]||(t[8]=e("label",{class:"block text-sm font-medium mb-1"},"结尾画面",-1)),d(e("textarea",{"onUpdate:modelValue":t[3]||(t[3]=a=>l.value.ending=a),rows:"2",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"合影留念..."},null,512),[[n,l.value.ending]])]),e("div",null,[t[9]||(t[9]=e("label",{class:"block text-sm font-medium mb-1"},"字幕内容",-1)),d(e("textarea",{"onUpdate:modelValue":t[4]||(t[4]=a=>l.value.subtitle=a),rows:"2",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"劳动最光荣..."},null,512),[[n,l.value.subtitle]])]),e("button",{onClick:p,disabled:r.value||!l.value.title,class:"w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"},m(r.value?"生成中...":"生成脚本"),9,k)])]),e("div",null,[t[12]||(t[12]=e("h3",{class:"font-medium text-gray-900 dark:text-white mb-4"},"生成结果",-1)),e("div",h,[o.value?(i(),u("pre",V,m(o.value),1)):(i(),u("div",U,[...t[11]||(t[11]=[e("div",{class:"text-center"},[e("p",{class:"text-4xl mb-2"},"🎬"),e("p",null,"点击生成短视频脚本")],-1)])]))]),o.value?(i(),u("div",$,[e("button",{onClick:x,class:"flex-1 py-2 bg-green-500 text-white rounded-lg"},"复制"),e("button",{onClick:v,class:"flex-1 py-2 bg-gray-500 text-white rounded-lg"},"下载")])):w("",!0)])]))}};export{E as default};
