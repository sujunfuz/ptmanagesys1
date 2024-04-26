//公有部分
const constantParam = [
  // {
  //   field: 'paramName',
  //   formatter: () => {
  //     return (
  //       <>
  //         <div class="flex items-center" v-else>
  //           <span class="w-8px h-8px border-rd-100% bg-red-500 inline-block"></span>
  //           <span class="ml-4px">冻结</span>
  //         </div>
  //       </>
  //     )
  //   }
  // },
  // {
  //   field: 'paramText',
  //   slots: {
  //     default: (data) => {
  //       return (
  //         <>
  //           <div>
  //             <span>试试</span>
  //           </div>
  //         </>
  //       )
  //     }
  //   }
  // }
]
export default function generateSchema(fieldStr: any, fieldParam: any = []) {
  // const tempStr = JSON.parse(fieldStr)
  const tempStr = fieldStr
  const schemaArr: any = []
  tempStr.forEach((item: any) => {
    let obj = {
      field: item.field,
      label: item.label,
      width: item.width + 'px'
    }
    let flag = true //查看私有的是否有
    for (const aitem of fieldParam) {
      if (aitem.field == obj.field) {
        obj = {
          ...obj,
          ...aitem
        }
        obj.label = item.label
        flag = false
        break
      }
    }
    if (flag) {
      for (const aitem of constantParam) {
        if (aitem.field == obj.field) {
          obj = {
            ...obj,
            ...aitem
          }
          break
        }
      }
    }
    schemaArr.push(obj)
  })
  return schemaArr
}
