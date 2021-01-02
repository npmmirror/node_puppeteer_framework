// ----------------------------------------------------------------------
// 通过消息队列的方式去逐步拉取
// 2020年4月11日 23:55:00 暂未启用
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import BaseTask from '../../libs/Base/BaseTask'
import RabbitMQ, { ACK_YES } from '../../libs/MQ/RabbitMQ'
import CONST_BUSINESS_COMIC from "../../constant/business_comic";
import CONST_AMQP from "../../constant/amqp";
import ContextTool from "../../tools/ContextTool";
import Log from "../../tools/Log";
import {ACK_NO} from "../../../es5/libs/MQ/RabbitMQ";
import TaskLogic from '../../logics/ComicCurl/TaskLogic';

// ----------------------------------------------------------------------
//      漫画爬虫处理中心
// ----------------------------------------------------------------------

export default class ComicTask extends BaseTask {
    // ----------------------------------------------------------------------
    // 调用示例
    // node ./es5/task.js comic base_consumer
    // ----------------------------------------------------------------------

    /**
     * 拉取基本信息
     */
    static async base_consumer() {
        // 示例消息格式
        // {"id":1,"event":"sub"}
        const mq = new RabbitMQ();
        mq.set_exchange(CONST_AMQP.AMQP_EXCHANGE_TOPIC)
        mq.set_routing_key(CONST_AMQP.AMQP_ROUTING_KEY_COMIC_BASE)
        mq.set_queue(CONST_AMQP.AMQP_QUEUE_COMIC_BASE)
        mq.set_block_second(CONST_BUSINESS_COMIC.MQ_CONSUMER_BLOCK_SECOND)
        await mq.pull(async (payload) => {
            let ctx = ContextTool.initial() // 每次拉取都是一个新的上下文
            try {
                Log.ctxInfo(ctx, 'base_consumer.start')
                let result = await TaskLogic.comic_base(ctx, payload)
                if (result === CONST_BUSINESS_COMIC.TASK_FAILED) {
                    throw new Error("TASK_FAILED");
                }
                Log.ctxInfo(ctx, 'base_consumer.success  ' + JSON.stringify(payload))
                return ACK_YES
            } catch (err) {
                Log.ctxInfo(ctx, 'base_consumer.payload  ' + JSON.stringify(payload))
                Log.ctxError(ctx, 'base_consumer.CONSUMER_ERROR  ' + err.stack)
            }
            return ACK_NO
        })
    }

    /**
     * 拉取渠道基本信息
     */
    static async base_supplier_consumer() {
        let _this = this
        // 示例消息格式
        // {"id":1,"event":"sub"}
        const mq = new RabbitMQ();
        mq.set_exchange(CONST_AMQP.AMQP_EXCHANGE_TOPIC)
        mq.set_routing_key(CONST_AMQP.AMQP_ROUTING_KEY_SUPPLIER_BASE)
        mq.set_queue(CONST_AMQP.AMQP_QUEUE_SUPPLIER_BASE)
        mq.set_block_second(CONST_BUSINESS_COMIC.MQ_CONSUMER_BLOCK_SECOND)
        await mq.pull(async (payload) => {
            let ctx = ContextTool.initial() // 每次拉取都是一个新的上下文
            try {
                Log.ctxInfo(ctx, 'base_supplier_consumer.start')
                let result = await TaskLogic.base_supplier_consumer(ctx, payload)
                if (result === CONST_BUSINESS_COMIC.TASK_FAILED) {
                    throw new Error("TASK_FAILED");
                }
                Log.ctxInfo(ctx, 'base_supplier_consumer.success  ' + JSON.stringify(payload))
                return ACK_YES
            } catch (err) {
                Log.ctxInfo(ctx, 'base_supplier_consumer.payload  ' + JSON.stringify(payload))
                Log.ctxError(ctx, 'base_supplier_consumer.CONSUMER_ERROR  ' + err.stack)
            }
            return ACK_NO
        })
    }

}