<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col>
                <span class="expand-key">请求参数：{{ row.requestParam }}</span>
            </Col>
        </Row>
        <Row>
            <Col>
                <span class="expand-key">错误消息：{{ row.responseData }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
}
</script>
