import{o as i,c as u,a as t,f as w,x as o,z as d,t as m,b as y,d as p,E as b}from"./index-DO37WybI.js";const f={class:"grid grid-cols-1 lg:grid-cols-2 gap-6"},k={class:"space-y-4"},c=["disabled"],V={class:"min-h-[500px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"},h={key:0,class:"whitespace-pre-wrap text-sm font-serif"},U={key:1,class:"h-full flex items-center justify-center text-gray-400"},$={key:0,class:"mt-4 flex gap-3"},E={__name:"ActivityPlan",setup(B){const l=p({title:"",theme:"",time:"",location:"",participants:"",content:"",awards:"",responsibility:""}),n=p(!1),r=p(""),g=()=>{if(!l.value.title){b.warning("请输入策划标题");return}n.value=!0,setTimeout(()=>{const a=l.value;r.value=`${a.title}

一、活动主题
${a.theme||a.title}

二、活动时间
${a.time||"待定"}

三、活动地点
${a.location||"待定"}

四、参与人员
${a.participants||"全体职工"}

五、活动内容
${a.content||`（一）开幕式
（二）主体活动
（三）闭幕式`}

六、奖项设置
${a.awards||"一等奖、二等奖、三等奖、参与奖"}

七、组织分工
${a.responsibility||"策划组、执行组、后勤组、宣传组"}

八、经费预算
${a.awards?`奖品费用：待定
场地费用：待定
其他费用：待定`:""}

九、安全预案
活动期间需做好安全防护工作，确保活动顺利进行。

十、工作要求
1. 各相关部门要高度重视，精心组织
2. 明确责任分工，确保活动效果
3. 做好宣传报道，及时总结经验`,n.value=!1,b.success("生成成功！")},500)},x=()=>{navigator.clipboard.writeText(r.value),b.success("已复制")},v=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([r.value])),a.download=`${l.value.title}.txt`,a.click()};return(a,e)=>(i(),u("div",f,[t("div",null,[e[16]||(e[16]=t("h3",{class:"font-medium text-gray-900 dark:text-white mb-4"},"填写信息",-1)),t("div",k,[t("div",null,[e[8]||(e[8]=t("label",{class:"block text-sm font-medium mb-1"},[w("策划标题 "),t("span",{class:"text-red-500"},"*")],-1)),o(t("input",{"onUpdate:modelValue":e[0]||(e[0]=s=>l.value.title=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"例如：五一劳动节活动策划方案"},null,512),[[d,l.value.title]])]),t("div",null,[e[9]||(e[9]=t("label",{class:"block text-sm font-medium mb-1"},"活动主题",-1)),o(t("input",{"onUpdate:modelValue":e[1]||(e[1]=s=>l.value.theme=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"例如：劳动最光荣"},null,512),[[d,l.value.theme]])]),t("div",null,[e[10]||(e[10]=t("label",{class:"block text-sm font-medium mb-1"},"活动时间",-1)),o(t("input",{"onUpdate:modelValue":e[2]||(e[2]=s=>l.value.time=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"2024年5月1日"},null,512),[[d,l.value.time]])]),t("div",null,[e[11]||(e[11]=t("label",{class:"block text-sm font-medium mb-1"},"活动地点",-1)),o(t("input",{"onUpdate:modelValue":e[3]||(e[3]=s=>l.value.location=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"公司职工活动中心"},null,512),[[d,l.value.location]])]),t("div",null,[e[12]||(e[12]=t("label",{class:"block text-sm font-medium mb-1"},"参与对象",-1)),o(t("input",{"onUpdate:modelValue":e[4]||(e[4]=s=>l.value.participants=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"全体职工"},null,512),[[d,l.value.participants]])]),t("div",null,[e[13]||(e[13]=t("label",{class:"block text-sm font-medium mb-1"},"活动内容",-1)),o(t("textarea",{"onUpdate:modelValue":e[5]||(e[5]=s=>l.value.content=s),rows:"3",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:`（一）开幕式
（二）主体活动
（三）闭幕式`},null,512),[[d,l.value.content]])]),t("div",null,[e[14]||(e[14]=t("label",{class:"block text-sm font-medium mb-1"},"奖项设置",-1)),o(t("textarea",{"onUpdate:modelValue":e[6]||(e[6]=s=>l.value.awards=s),rows:"2",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"一等奖、二等奖、三等奖、参与奖"},null,512),[[d,l.value.awards]])]),t("div",null,[e[15]||(e[15]=t("label",{class:"block text-sm font-medium mb-1"},"组织分工",-1)),o(t("textarea",{"onUpdate:modelValue":e[7]||(e[7]=s=>l.value.responsibility=s),rows:"2",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"策划组、执行组、后勤组"},null,512),[[d,l.value.responsibility]])]),t("button",{onClick:g,disabled:n.value||!l.value.title,class:"w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"},m(n.value?"生成中...":"生成策划方案"),9,c)])]),t("div",null,[e[18]||(e[18]=t("h3",{class:"font-medium text-gray-900 dark:text-white mb-4"},"生成结果",-1)),t("div",V,[r.value?(i(),u("pre",h,m(r.value),1)):(i(),u("div",U,[...e[17]||(e[17]=[t("div",{class:"text-center"},[t("p",{class:"text-4xl mb-2"},"🎪"),t("p",null,"点击生成策划方案")],-1)])]))]),r.value?(i(),u("div",$,[t("button",{onClick:x,class:"flex-1 py-2 bg-green-500 text-white rounded-lg"},"复制"),t("button",{onClick:v,class:"flex-1 py-2 bg-gray-500 text-white rounded-lg"},"下载")])):y("",!0)])]))}};export{E as default};
