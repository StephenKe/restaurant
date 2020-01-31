<template>
    <div class="dashboard">
        <div v-if="CONFIG.ua === 'pc'" :class="['translate_wrapper', {'active': active}]">
            <div class="current_lang">
                <div class="lang" @click.stop="toggleLang">
                    <span class="lang-txt">{{$t('text')}}</span>
                    <i style="display: inline-block;vertical-align: middle;margin-left: 10px" class="el-icon-arrow-down"></i>
                </div>
            </div>
            <div ref="moreLang" :class="['more_lang', {'active': lazyActive}]">

                <div v-if="CONFIG.lang !== 'zh'" class="lang" @click="langSelect('zh-CN')" data-lang='zh-CN' value="简体中文">
                    <span class="lang-txt">中文</span>
                </div>

                <div v-if="CONFIG.lang !== 'en'" class="lang" @click="langSelect('en')" data-lang='en' value="English">
                    <span class="lang-txt">English</span>
                </div>

            </div>


        </div>
        <div
                v-if="CONFIG.ua === 'mobile'"
                class="iconfont icon-menu"
                style="position: fixed;right: 5px;top: 5px;font-size: 30px;color: #67C23A;z-index: 100"
                @click="drawer = true"
        ></div>
        <el-drawer
                :title="$t('lang')"
                :visible.sync="drawer"
                direction="rtl"
                :show-close="false"
                size="40%"
                style="font-size: 20px;text-align: center"
                >
            <el-divider></el-divider>
            <div v-if="CONFIG.lang !== 'zh'" @click="langSelect('zh-CN')" data-lang='zh-CN' value="简体中文">
                <span class="lang-txt">中文</span>
            </div>

            <div v-if="CONFIG.lang !== 'en'" @click="langSelect('en')" data-lang='en' value="English">
                <span class="lang-txt">English</span>
            </div>
            <el-divider></el-divider>
        </el-drawer>
        <el-dialog :title="$t('booking')" :visible.sync="dialogFormVisible" width="70%" @close="form.date = ''">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item :label="$t('address')">
                    <gmap-map
                            :center="{lat:currentRow.lat, lng:currentRow.lng}"
                            :zoom="7"
                            style="width: 100%; height: 300px"
                    >
                        <gmap-marker
                                :position="{lat:currentRow.lat, lng:currentRow.lng}"
                                :clickable="false"
                                :draggable="false"
                        ></gmap-marker>
                    </gmap-map>
                </el-form-item>
                <el-form-item :label="$t('name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('phone')" prop="phone">
                    <el-input v-model="form.phone" type="tel"></el-input>
                </el-form-item>
                <el-form-item :label="$t('member')" prop="member">
                    <el-select v-model="form.member" :placeholder="`${$t('select')}${$t('quantity')}`">
                        <el-option
                                v-for="i in 20"
                                :key="i"
                                :label="i"
                                :value="i"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('date')" prop="date">
                    <el-date-picker
                            v-model="form.date"
                            type="date"
                            :placeholder="`${$t('select')}${$t('date')}`"
                            :picker-options="datePickerOptions"
                            @change="dateChange"
                            >
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="form.date" :label="$t('time')" prop="time">
                    <el-time-picker
                            v-model="form.time"
                            :picker-options="timePickerOptions"
                            :placeholder="`${$t('select')}${$t('time')}`"
                            >
                    </el-time-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="submit">{{$t('booking')}}</el-button>
            </div>
        </el-dialog>
        <el-collapse v-model="activeNames"  @change="handleChange">
            <el-collapse-item title="" name="1">
                <template slot="title">
                    <h3 style="text-align: center;width: 100%;color: #409EFF">
                        <i class="header-icon el-icon-d-caret"></i>{{$t('quick')}}{{$t('query')}} ({{$t('click')}}{{activeStatus}})
                    </h3>
                </template>
                <el-form
                        :style="{width: CONFIG.ua === 'pc' ? '50%' : '100%'}"
                        ref="qryForm"
                        :model="qryForm"
                        label-position="left"
                        :label-width="CONFIG.ua === 'pc' ? '100px' : '50px'">
                    <el-form-item :label="$t('restaurant')">
                        <el-autocomplete
                                class="inline-input"
                                v-model="qryForm.value"
                                :fetch-suggestions="querySearch"
                                clearable
                                :placeholder="`${$t('input')}${$t('restaurant')}`"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item :label="$t('member')">
                        <el-select v-model="qryForm.member" :placeholder="`${$t('select')}${$t('quantity')}`">
                            <el-option
                                    v-for="i in 20"
                                    :key="i"
                                    :label="i"
                                    :value="i"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('date')">
                        <el-date-picker
                                v-model="qryForm.date"
                                type="date"
                                :picker-options="qryDatePickerOptions"
                                :placeholder="`${$t('select')}${$t('date')}`"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('time')">
                        <el-time-picker
                                v-model="qryForm.time"
                                value-format="HH:mm:ss"
                                :placeholder="`${$t('select')}${$t('time')}`"
                        >
                        </el-time-picker>
                    </el-form-item>
                    <el-button type="warning" style="margin-right: 30px" @click="reset">{{$t('reset')}}</el-button>
                    <el-button type="primary" @click="query">{{$t('query')}}</el-button>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item :label="$t('type')">
                            <span>{{ props.row.type }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('park')">
                            <span>{{ ['無', '有'][props.row.park] }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('delivery')">
                            <span>{{ ['無', '有'][props.row.delivery] }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('deposit')">
                            <span>{{ ['否', '是'][props.row.deposit] }}</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" round @click="showDialog(props.row)">{{$t('booking')}}</el-button>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('restaurant')"
                    prop="value">
            </el-table-column>
            <el-table-column
                    :label="$t('mql')"
                    prop="mql">
                <template slot-scope="props">
                    <el-rate
                            v-if="Boolean(Number(props.row.mql))"
                            v-model="props.row.mql"
                            :max="3"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}">
                    </el-rate>
                    <div v-if="props.row.mql === '無'">無 <i class="iconfont icon-mianwubiaoqing" style="color: #F7BA2A"></i></div>
                    <div v-if="props.row.mql === '推薦'">推薦 <i class="iconfont icon-dianzan" style="color: #F7BA2A"></i></div>
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('rate')"
                    prop="rate">
                <template slot-scope="props">
                    <el-rate
                            v-model="props.row.rate"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}">
                    </el-rate>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import '../assets/css/style.css'

    export default {
        name: "dashboard",
        data() {
            let _this = this
            return {
                drawer: false,
                active: false,
                lazyActive: false,
                activeNames: ['1'],
                activeStatus: this.$t('fold'),
                qryForm: {
                    value: '',
                    member: '',
                    date: '',
                    time: ''
                },
                qryDatePickerOptions: {
                    disabledDate(date) {
                        return _this.CONFIG.formatDate(date) < _this.CONFIG.formatDate(Date.now())
                    }
                },
                datePickerOptions: {
                    disabledDate(date) {
                        return _this.CONFIG.formatDate(date) < _this.CONFIG.formatDate(Date.now()) || new Date(date).getDay() === _this.currentRow.week.indexOf(0)
                    }
                },
                timePickerOptions: {
                    selectableRange: ''
                },
                form: {
                    name: '',
                    phone: '',
                    member: '',
                    date: '',
                    time: ''
                },
                rules: {
                    name: { required: true, message: `${this.$t('need')}${this.$t('name')}`, trigger: 'blur' },
                    phone: [
                        { required: true, message: `${this.$t('need')}${this.$t('phone')}`, trigger: 'blur' },
                        { min: 3, max: 20, message: `${this.$t('length')}: 3 ${this.$t('to')} 20`, trigger: 'blur' }
                    ],
                    member: { required: true, message: `${this.$t('need')}${this.$t('member')}`, trigger: 'blur' },
                    date: { required: true, message: `${this.$t('need')}${this.$t('date')}`, trigger: 'blur' },
                    time: { required: true, message: `${this.$t('need')}${this.$t('date')}`, trigger: 'blur' }
                },
                currentRow: {},
                dialogFormVisible: false,
                tableData: JSON.parse(JSON.stringify(this.CONFIG.data))
            }
        },
        mounted() {
            this.$nextTick(() => {

            })
        },
        methods: {
            toggleLang() {
                this.active = !this.active
                setTimeout(() => {
                    this.lazyActive = this.active
                }, 5)
            },
            langSelect(lang) {
                window.sessionStorage.setItem('LANG', lang)
                window.location.reload()
            },
            showDialog(row) {
                this.currentRow = row
                this.dialogFormVisible = true
            },
            dateChange(val) {
                if (!val) return;
                this.timePickerOptions.selectableRange = this.currentRow.week[new Date(val).getDay()]
            },
            handleChange(val) {
                this.activeStatus = val.length ? this.$t('fold') : this.$t('unfold')
            },
            querySearch(queryString, cb) {
                let restaurants = this.tableData
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
                cb(results)
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return new RegExp(queryString).test(restaurant.value)
                }
            },
            reset() {
                this.qryForm = {
                    value: '',
                    member: '',
                    date: '',
                    time: ''
                }
                this.tableData = JSON.parse(JSON.stringify(this.CONFIG.data))
            },
            queryTime(times) {
                let minTime = [], maxTime = []
                times.forEach((ite) => {
                    if (ite) {
                        minTime.push(ite.split('-')[0].trim())
                        maxTime.push(ite.split('-')[1].trim())
                    }
                })
                minTime = minTime.sort()[0]
                maxTime = maxTime.sort().reverse()[0]
                if (minTime > maxTime) {
                    maxTime = this.CONFIG.addHourTime(maxTime, 24)
                }
                return [minTime, maxTime]
            },
            query() {
                let qryForm = Object.assign({}, this.qryForm)
                for (let x in qryForm) {
                    if (!qryForm[x]) {
                        delete qryForm[x]
                    }
                }
                this.tableData = this.CONFIG.data.filter((item) => {
                    for (let y in qryForm) {
                        if (y === 'value') return item['value'] === qryForm['value'];
                        if (y === 'date') {
                            let day = new Date(qryForm['date']).getDay()
                            if (qryForm['time']) {
                                let [ minTime, maxTime ] = this.queryTime(item['week'])
                                return item['week'][day] &&
                                    ((qryForm['time'] >= minTime && qryForm['time'] <= maxTime) ||
                                        (this.CONFIG.addHourTime(qryForm['time'], 24) >= minTime && this.CONFIG.addHourTime(qryForm['time'], 24) <= maxTime))
                            }
                            return item['week'][day]
                        }
                        if (y === 'time') {
                            let [ minTime, maxTime ] = this.queryTime(item['week'])
                            return (qryForm['time'] >= minTime && qryForm['time'] <= maxTime) ||
                                (this.CONFIG.addHourTime(qryForm['time'], 24) >= minTime && this.CONFIG.addHourTime(qryForm['time'], 24) <= maxTime)
                        }
                    }
                    return item
                })
            },
            submit() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.$message.error(`${this.$t('check')}${this.$t('required')}`)
                        return
                    }
                    this.$message({
                        message: `${this.$t('booking')}${this.$t('success')}`,
                        type: 'success'
                    })
                    this.dialogFormVisible = false
                })
            }
        }
    }
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .dashboard /deep/ .el-form-item__label {
        font-weight: bold;
    }
    .dashboard /deep/ .el-collapse .el-form {
        /*width: 50%;*/
        margin: 0 auto;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 10px 40px;
        margin-top: 10px;
    }
</style>