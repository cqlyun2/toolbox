import{o as u,c as i,a as t,f as w,x as o,z as d,t as b,b as f,d as m,E as g}from"./index-C98w5xzA.js";const y={class:"grid grid-cols-1 lg:grid-cols-2 gap-6"},k={class:"space-y-4"},c=["disabled"],V={class:"min-h-[500px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"},h={key:0,class:"whitespace-pre-wrap text-sm font-serif"},U={key:1,class:"h-full flex items-center justify-center text-gray-400"},$={key:0,class:"mt-4 flex gap-3"},C={__name:"TrainingPlan",setup(T){const l=m({title:"",goal:"",target:"",time:"",location:"",content:"",method:"",assessment:""}),r=m(!1),n=m(""),p=()=>{if(!l.value.title){g.warning("请输入培训标题");return}r.value=!0,setTimeout(()=>{const s=l.value;n.value=`${s.title}

一、培训目标
${s.goal||"提升员工业务能力和综合素质"}

二、培训对象
${s.target||"待定"}

三、培训时间
${s.time||"待定"}

四、培训地点
${s.location||"待定"}

五、培训内容
${s.content||`1. 企业文化
2. 规章制度
3. 业务技能
4. 安全教育`}

六、培训方式
${s.method||"集中授课、实操演练、案例分析"}

七、培训师资
内部讲师+外部专家

八、考核方式
${s.assessment||"笔试+实操"}

九、经费预算
培训费用：待定
教材费用：待定
其他费用：待定

十、工作要求
1. 高度重视，认真组织
2. 严格考勤，确保效果
3. 及时总结，改进提高`,r.value=!1,g.success("生成成功！")},500)},x=()=>{navigator.clipboard.writeText(n.value),g.success("已复制")},v=()=>{const s=document.createElement("a");s.href=URL.createObjectURL(new Blob([n.value])),s.download=`${l.value.title}.txt`,s.click()};return(s,e)=>(u(),i("div",y,[t("div",null,[e[16]||(e[16]=t("h3",{class:"font-medium text-gray-900 dark:text-white mb-4"},"填写信息",-1)),t("div",k,[t("div",null,[e[8]||(e[8]=t("label",{class:"block text-sm font-medium mb-1"},[w("培训标题 "),t("span",{class:"text-red-500"},"*")],-1)),o(t("input",{"onUpdate:modelValue":e[0]||(e[0]=a=>l.value.title=a),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"例如：新员工入职培训方案"},null,512),[[d,l.value.title]])]),t("div",null,[e[9]||(e[9]=t("label",{class:"block text-sm font-medium mb-1"},"培训目标",-1)),o(t("textarea",{"onUpdate:modelValue":e[1]||(e[1]=a=>l.value.goal=a),rows:"2",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"帮助新员工了解企业文化..."},null,512),[[d,l.value.goal]])]),t("div",null,[e[10]||(e[10]=t("label",{class:"block text-sm font-medium mb-1"},"培训对象",-1)),o(t("input",{"onUpdate:modelValue":e[2]||(e[2]=a=>l.value.target=a),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"新入职员工"},null,512),[[d,l.value.target]])]),t("div",null,[e[11]||(e[11]=t("label",{class:"block text-sm font-medium mb-1"},"培训时间",-1)),o(t("input",{"onUpdate:modelValue":e[3]||(e[3]=a=>l.value.time=a),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"2024年5月"},null,512),[[d,l.value.time]])]),t("div",null,[e[12]||(e[12]=t("label",{class:"block text-sm font-medium mb-1"},"培训地点",-1)),o(t("input",{"onUpdate:modelValue":e[4]||(e[4]=a=>l.value.location=a),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"公司会议室"},null,512),[[d,l.value.location]])]),t("div",null,[e[13]||(e[13]=t("label",{class:"block text-sm font-medium mb-1"},"培训内容",-1)),o(t("textarea",{"onUpdate:modelValue":e[5]||(e[5]=a=>l.value.content=a),rows:"3",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:`1. 企业文化
2. 规章制度
3. 业务技能`},null,512),[[d,l.value.content]])]),t("div",null,[e[14]||(e[14]=t("label",{class:"block text-sm font-medium mb-1"},"培训方式",-1)),o(t("textarea",{"onUpdate:modelValue":e[6]||(e[6]=a=>l.value.method=a),rows:"2",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"集中授课、实操演练、案例分析"},null,512),[[d,l.value.method]])]),t("div",null,[e[15]||(e[15]=t("label",{class:"block text-sm font-medium mb-1"},"考核方式",-1)),o(t("textarea",{"onUpdate:modelValue":e[7]||(e[7]=a=>l.value.assessment=a),rows:"2",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"笔试+实操"},null,512),[[d,l.value.assessment]])]),t("button",{onClick:p,disabled:r.value||!l.value.title,class:"w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"},b(r.value?"生成中...":"生成培训方案"),9,c)])]),t("div",null,[e[18]||(e[18]=t("h3",{class:"font-medium text-gray-900 dark:text-white mb-4"},"生成结果",-1)),t("div",V,[n.value?(u(),i("pre",h,b(n.value),1)):(u(),i("div",U,[...e[17]||(e[17]=[t("div",{class:"text-center"},[t("p",{class:"text-4xl mb-2"},"📚"),t("p",null,"点击生成培训方案")],-1)])]))]),n.value?(u(),i("div",$,[t("button",{onClick:x,class:"flex-1 py-2 bg-green-500 text-white rounded-lg"},"复制"),t("button",{onClick:v,class:"flex-1 py-2 bg-gray-500 text-white rounded-lg"},"下载")])):f("",!0)])]))}};export{C as default};
