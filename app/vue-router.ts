import VueRouter from 'vue-router';
import RouterMenu from '@c/RouterMenu/RouterMenu.vue';
import Mark360Excel from '@c/Mark360Excel/Mark360Excel.vue';
import CourseSetActive from '@c/CourseSetActive/CourseSetActive.vue';
import AssessmentQuestion from '@c/AssessmentQuestion/AssessmentQuestion.vue';
import GroupPollsReport from '@c/GroupPollsReport/GroupPollsReport.vue';
import CreateExcel from '@c/CreateExcel/CreateExcel.vue';
import PpRequest from '@c/PpRequest/PpRequest.vue';
import CollaboratorImport from '@c/CollaboratorImport/CollaboratorImport.vue';
import Questions from '@c/Questions/Questions.vue';

export default new VueRouter({
  routes: [
    {path: '/profiles/:profile?', component: RouterMenu},
    {path: '/(.*)/mark_360', component: Mark360Excel},
    {path: '/(.*)/course_set_active', component: CourseSetActive},
    {path: '/(.*)/assessment_question', component: AssessmentQuestion},
    {path: '/(.*)/group_polls_report', component: GroupPollsReport},
    {path: '/(.*)/create_excel', component: CreateExcel},
    {path: '/(.*)/pp_request', component: PpRequest},
    {path: '/(.*)/collaborators_import', component: CollaboratorImport},
    {path: '/(.*)/questions', component: Questions},
  ]
});
