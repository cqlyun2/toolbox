import{o as u,c as i,a as e,f as y,x as o,z as r,t as b,b as f,d as g,E as m}from"./index-C98w5xzA.js";const w={class:"grid grid-cols-1 lg:grid-cols-2 gap-6"},c={class:"space-y-4"},k=["disabled"],V={class:"min-h-[400px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"},h={key:0,class:"whitespace-pre-wrap text-sm font-serif"},U={key:1,class:"h-full flex items-center justify-center text-gray-400"},$={key:0,class:"mt-4 flex gap-3"},B={__name:"EmploymentPlan",setup(N){const l=g({title:"",target:"",content:"",time:"",targetNum:"",budget:""}),n=g(!1),d=g(""),p=()=>{if(!l.value.title){m.warning("请输入方案标题");return}n.value=!0,setTimeout(()=>{const a=l.value;d.value=`${a.title}

一、指导思想
深入贯彻落实党中央、国务院关于就业工作的决策部署，帮助${a.target||"就业困难人员"}实现稳定就业。

二、帮扶对象
${a.target||"就业困难人员、失业职工"}

三、工作目标
帮助 ${a.targetNum||"若干"} 名帮扶对象实现就业或创业

四、服务内容
${a.content||`1. 岗位推荐：根据求职者技能和意愿，匹配合适岗位
2. 技能培训：开展职业技能培训，提升就业能力
3. 创业扶持：提供创业指导和小额贷款支持
4. 政策咨询：宣传就业创业政策`}

五、活动时间
${a.time||"2024年1月-12月"}

六、组织分工
工会负责组织实施，人力资源部门配合，基层工会协助落实

七、经费预算
${a.budget||"待定"}元

八、工作要求
1. 高度重视，精心组织
2. 摸清底数，建立台账
3. 精准对接，确保实效
4. 及时总结，推广经验`,n.value=!1,m.success("生成成功！")},500)},x=()=>{navigator.clipboard.writeText(d.value),m.success("已复制")},v=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([d.value])),a.download=`${l.value.title}.txt`,a.click()};return(a,t)=>(u(),i("div",w,[e("div",null,[t[12]||(t[12]=e("h3",{class:"font-medium text-gray-900 dark:text-white mb-4"},"填写信息",-1)),e("div",c,[e("div",null,[t[6]||(t[6]=e("label",{class:"block text-sm font-medium mb-1"},[y("方案标题 "),e("span",{class:"text-red-500"},"*")],-1)),o(e("input",{"onUpdate:modelValue":t[0]||(t[0]=s=>l.value.title=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"例如：2024年就业帮扶服务方案"},null,512),[[r,l.value.title]])]),e("div",null,[t[7]||(t[7]=e("label",{class:"block text-sm font-medium mb-1"},"帮扶对象",-1)),o(e("input",{"onUpdate:modelValue":t[1]||(t[1]=s=>l.value.target=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"困难职工、待业人员"},null,512),[[r,l.value.target]])]),e("div",null,[t[8]||(t[8]=e("label",{class:"block text-sm font-medium mb-1"},"服务内容",-1)),o(e("textarea",{"onUpdate:modelValue":t[2]||(t[2]=s=>l.value.content=s),rows:"3",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:`1. 岗位推荐
2. 技能培训
3. 创业扶持`},null,512),[[r,l.value.content]])]),e("div",null,[t[9]||(t[9]=e("label",{class:"block text-sm font-medium mb-1"},"活动时间",-1)),o(e("input",{"onUpdate:modelValue":t[3]||(t[3]=s=>l.value.time=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"2024年全年"},null,512),[[r,l.value.time]])]),e("div",null,[t[10]||(t[10]=e("label",{class:"block text-sm font-medium mb-1"},"目标人数",-1)),o(e("input",{"onUpdate:modelValue":t[4]||(t[4]=s=>l.value.targetNum=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"100人"},null,512),[[r,l.value.targetNum]])]),e("div",null,[t[11]||(t[11]=e("label",{class:"block text-sm font-medium mb-1"},"预算金额",-1)),o(e("input",{"onUpdate:modelValue":t[5]||(t[5]=s=>l.value.budget=s),type:"text",class:"w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white",placeholder:"10万元"},null,512),[[r,l.value.budget]])]),e("button",{onClick:p,disabled:n.value||!l.value.title,class:"w-full py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"},b(n.value?"生成中...":"生成就业服务方案"),9,k)])]),e("div",null,[t[14]||(t[14]=e("h3",{class:"font-medium text-gray-900 dark:text-white mb-4"},"生成结果",-1)),e("div",V,[d.value?(u(),i("pre",h,b(d.value),1)):(u(),i("div",U,[...t[13]||(t[13]=[e("div",{class:"text-center"},[e("p",{class:"text-4xl mb-2"},"💼"),e("p",null,"点击生成就业服务方案")],-1)])]))]),d.value?(u(),i("div",$,[e("button",{onClick:x,class:"flex-1 py-2 bg-green-500 text-white rounded-lg"},"复制"),e("button",{onClick:v,class:"flex-1 py-2 bg-gray-500 text-white rounded-lg"},"下载")])):f("",!0)])]))}};export{B as default};
