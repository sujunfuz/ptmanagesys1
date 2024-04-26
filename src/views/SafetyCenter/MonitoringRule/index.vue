<template>
  <div>
    <!-- 注册/登录 -->
    <ContentWrap class="w-100%">
      <div class="font-size-18px">{{ t('monitoringRule.title1') }}</div>
      <div class="flex-c mt-20px">
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_1') }}</div>
          <div class="items flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.item1_1') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_2') }}</div>
          <div class="items flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.item1_2') }}</div>
          </div></div
        >
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_3') }}</div>
          <div class="items">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item1_3') }}</div>
            <div class="sub br-top h-96px line-height-96px"> {{ t('monitoringRule.item1_3') }}</div>
            <div class="sub br-top h-96px line-height-96px"> {{ t('monitoringRule.item1_5') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item1_6') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item1_7') }}</div>
          </div>
        </div>
        <div class="block w-550px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_4') }}</div>
          <div class="items">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item1_8') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item1_9') }}</div>
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item1_10') }}</div
            >
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item1_11') }}</div
            >
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item1_12') }}</div
            >
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item1_13') }}</div
            >
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item1_14') }}</div
            >
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_5') }}</div>
          <div class="items flex flex-items-center">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item1_15') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_6') }}</div>
          <div class="items">
            <div class="sub">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'REGISTER_LOGIN', REGISTER_LOGIN_ITEM[6]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(REGISTER_LOGIN_ITEM[6]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu v-hasPermi="'safetyCenter:safDetectRule:edit'">
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'REGISTER_LOGIN', REGISTER_LOGIN_ITEM[0]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(REGISTER_LOGIN_ITEM[0]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'REGISTER_LOGIN', REGISTER_LOGIN_ITEM[1]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(REGISTER_LOGIN_ITEM[1]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'REGISTER_LOGIN', REGISTER_LOGIN_ITEM[2]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(REGISTER_LOGIN_ITEM[2]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'REGISTER_LOGIN', REGISTER_LOGIN_ITEM[3]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(REGISTER_LOGIN_ITEM[3]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'REGISTER_LOGIN', REGISTER_LOGIN_ITEM[4]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(REGISTER_LOGIN_ITEM[4]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'REGISTER_LOGIN', REGISTER_LOGIN_ITEM[5]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(REGISTER_LOGIN_ITEM[5]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </ContentWrap>

    <!-- 购买 -->
    <ContentWrap class="w-100% mt-20px">
      <div class="font-size-18px">{{ t('monitoringRule.title2') }}</div>
      <div class="flex-c mt-20px">
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_1') }}</div>
          <div class="items flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.title2') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_2') }}</div>
          <div class="items flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.item2_1') }}</div>
          </div></div
        >
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_3') }}</div>
          <div class="items">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item1_3') }}</div>
            <div class="sub br-top h-96px line-height-96px"> {{ t('monitoringRule.item2_2') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item2_3') }}</div>
            <!-- <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item2_4') }}</div> -->
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item2_5') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item2_6') }}</div>
          </div>
        </div>
        <div class="block w-550px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_4') }}</div>
          <div class="items">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item2_7') }}</div>
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item1_11') }}</div
            >
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item1_12') }}</div
            >
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item2_8') }}</div>
            <!-- <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item2_9') }}</div> -->
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item2_10') }}</div
            >
            <div class="sub br-top h-45px line-height-45px">
              {{ t('monitoringRule.item2_11') }}</div
            >
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_5') }}</div>
          <div class="items flex flex-items-center">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item1_15') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_6') }}</div>
          <div class="items">
            <div class="sub">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'PURCHASE', PURCHASE_ITEM[0]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(PURCHASE_ITEM[0]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'PURCHASE', PURCHASE_ITEM[1]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(PURCHASE_ITEM[1]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'PURCHASE', PURCHASE_ITEM[2]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(PURCHASE_ITEM[2]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'PURCHASE', PURCHASE_ITEM[3]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(PURCHASE_ITEM[3]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <!-- <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'PURCHASE', PURCHASE_ITEM[4]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(PURCHASE_ITEM[4]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div> -->
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'PURCHASE', PURCHASE_ITEM[5]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(PURCHASE_ITEM[5]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'PURCHASE', PURCHASE_ITEM[6]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(PURCHASE_ITEM[6]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </ContentWrap>

    <!-- 商品 -->
    <ContentWrap class="w-100% mt-20px">
      <div class="font-size-18px">{{ t('monitoringRule.title3') }}</div>
      <div class="flex-c mt-20px">
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_1') }}</div>
          <div class="otitems h-96px flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.title3') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_2') }}</div>
          <div class="otitems flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.item3_1') }}</div>
          </div></div
        >
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_3') }}</div>
          <div class="otitems">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item3_2') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item3_3') }}</div>
          </div>
        </div>
        <div class="block w-550px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_4') }}</div>
          <div class="otitems">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item3_4') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item3_5') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_5') }}</div>
          <div class="otitems flex flex-items-center">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item1_15') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_6') }}</div>
          <div class="otitems">
            <div class="sub">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'GOODS', GOODS_ITEM[0]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(GOODS_ITEM[0]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'GOODS', GOODS_ITEM[1]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(GOODS_ITEM[1]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </ContentWrap>

    <!-- 订单 -->
    <ContentWrap class="w-100% mt-20px">
      <div class="font-size-18px">{{ t('monitoringRule.title4') }}</div>
      <div class="flex-c mt-20px">
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_1') }}</div>
          <div class="otitems1 h-141px flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.title4') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_2') }}</div>
          <div class="otitems1 flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.item3_1') }}</div>
          </div></div
        >
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_3') }}</div>
          <div class="otitems1">
            <div class="sub h-141px line-height-141px"> {{ t('monitoringRule.item4_1') }}</div>
          </div>
        </div>
        <div class="block w-550px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_4') }}</div>
          <div class="otitems1">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item4_2') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item4_3') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item4_4') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_5') }}</div>
          <div class="otitems1 flex flex-items-center">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item1_15') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_6') }}</div>
          <div class="otitems1">
            <div class="sub">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'ORDER', ORDER_ITEM[0]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(ORDER_ITEM[0]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'ORDER', ORDER_ITEM[1]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(ORDER_ITEM[1]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'ORDER', ORDER_ITEM[2]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(ORDER_ITEM[2]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </ContentWrap>

    <!-- 结算 -->
    <ContentWrap class="w-100% mt-20px">
      <div class="font-size-18px">{{ t('monitoringRule.title5') }}</div>
      <div class="flex-c mt-20px">
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_1') }}</div>
          <div class="otitems1 h-141px flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.title5') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_2') }}</div>
          <div class="otitems1 flex flex-items-center">
            <div class="sub"> {{ t('monitoringRule.item3_1') }}</div>
          </div></div
        >
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_3') }}</div>
          <div class="otitems1">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item5_1') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item5_2') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item5_2') }}</div>
          </div>
        </div>
        <div class="block w-550px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_4') }}</div>
          <div class="otitems1">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item5_3') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item5_4') }}</div>
            <div class="sub br-top h-45px line-height-45px"> {{ t('monitoringRule.item5_5') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_5') }}</div>
          <div class="otitems1 flex flex-items-center">
            <div class="sub h-45px line-height-45px"> {{ t('monitoringRule.item1_15') }}</div>
          </div>
        </div>
        <div class="block w-360px">
          <div class="title colorMain font-bold">{{ t('monitoringRule.sub1_6') }}</div>
          <div class="otitems1">
            <div class="sub">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'SETTLE', SETTLE_ITEM[0]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(SETTLE_ITEM[0]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'SETTLE', SETTLE_ITEM[1]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(SETTLE_ITEM[1]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sub br-top">
              <el-dropdown
                :disabled="disabledFlag"
                @command="(e) => handleCommand(e, 'SETTLE', SETTLE_ITEM[2]?.id)"
              >
                <span class="el-dropdown-link h-45px line-height-45px colorMain">
                  {{ getString(SETTLE_ITEM[2]?.action2) }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="item.value"
                      v-for="(item, index) in actionTypeEnum"
                      :key="index"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </ContentWrap>
  </div>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import {
  getPageTopApi,
  getRegisterLoginRuleApi,
  getPurchaseRuleApi,
  getGoodsRuleApi,
  getOrderRuleApi,
  getSettleRuleApi,
  postBatchEditApi
} from '@/api/safetyCenter/monitoringRule'
import { onMounted, ref } from 'vue'

const disabledFlag = ref(true)
const actionTypeEnum = ref()
const { t } = useI18n()

const REGISTER_LOGIN_ITEM = ref([])

const PURCHASE_ITEM = ref([])

const GOODS_ITEM = ref([])

const ORDER_ITEM = ref([])

const SETTLE_ITEM = ref([])

const getString = (item) => {
  for (var i in actionTypeEnum.value) {
    if (actionTypeEnum.value[i].value == item) {
      return actionTypeEnum.value[i].label
    }
  }
}
onMounted(async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    actionTypeEnum.value = res.data.actionTypeEnum
  }
  await getRegisterLoginRule()
  await getPurchaseRule()
  await getGoodsRule()
  await getOrderRule()
  await getSettleRule()
})

const getRegisterLoginRule = async () => {
  const res = await getRegisterLoginRuleApi()
  if (res.code == 200) {
    REGISTER_LOGIN_ITEM.value = res.data
  }
}

const getPurchaseRule = async () => {
  const res = await getPurchaseRuleApi()
  if (res.code == 200) {
    PURCHASE_ITEM.value = res.data
  }
}

const getGoodsRule = async () => {
  const res = await getGoodsRuleApi()
  if (res.code == 200) {
    GOODS_ITEM.value = res.data
  }
}

const getOrderRule = async () => {
  const res = await getOrderRuleApi()
  if (res.code == 200) {
    ORDER_ITEM.value = res.data
  }
}

const getSettleRule = async () => {
  const res = await getSettleRuleApi()
  if (res.code == 200) {
    SETTLE_ITEM.value = res.data
  }
}

const handleCommand = async (command: string | number | object, type, id) => {
  const res = await postBatchEditApi([
    {
      id: id,
      action1: 'ACTION_RECORD',
      action2: command
    }
  ])

  if (res.code == 200) {
    if (type == 'REGISTER_LOGIN') {
      await getRegisterLoginRule()
    } else if (type == 'PURCHASE') {
      await getPurchaseRule()
    } else if (type == 'GOODS') {
      await getGoodsRule()
    } else if (type == 'ORDER') {
      await getOrderRule()
    } else if (type == 'SETTLE') {
      await getSettleRule()
    }
    ElMessage.success(t('common.operateSuccess'))
  }
}
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-dropdown-link:focus {
  outline: none;
}
</style>

<style lang="less" scoped>
.block {
  // width: 380px;
  text-align: center;
  margin-right: 10px;
  .title {
    height: 40px;
    line-height: 40px;
    background-color: #e6effc;
  }

  .items {
    height: 350px;
    margin-top: 10px;
    background-color: #fafafa;
    text-align: left;
    // padding-left: 15px;
    padding-top: 5px;
  }

  .otitems {
    height: 100px;
    margin-top: 10px;
    background-color: #fafafa;
    text-align: left;
    // padding-left: 15px;
    padding-top: 5px;
  }

  .otitems1 {
    height: 145px;
    margin-top: 10px;
    background-color: #fafafa;
    text-align: left;
    // padding-left: 15px;
    padding-top: 5px;
  }

  .sub {
    font-size: 15px;
    color: #575a59;
    padding-left: 15px;
  }
  .br-top {
    border-top: white solid 5px;
  }
}
</style>
