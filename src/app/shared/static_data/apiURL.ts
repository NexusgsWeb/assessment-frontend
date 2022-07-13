import { question } from 'src/app/modules/Models/question';
import { environment } from 'src/environments/environment';
import { LearningObjective } from 'src/app/modules/Models/LearningObjective';
import { stat } from 'fs';

//The API 1
export const baseURL = environment.production
  ? 'https://uytxe3cnwd.execute-api.eu-west-1.amazonaws.com/dev/v1.0'
  : 'https://uytxe3cnwd.execute-api.eu-west-1.amazonaws.com/dev/v1.0';
// API 2
export const baseURL2 = environment.production
  ? 'https://ewyssocew0.execute-api.eu-west-1.amazonaws.com/dev/v1.0'
  : 'https://ewyssocew0.execute-api.eu-west-1.amazonaws.com/dev/v1.0';
// API 3 - Used for assessment/questionbank
export const baseURL3 = environment.production
  ? 'https://7t8xqn3z95.execute-api.eu-west-1.amazonaws.com/dev/v1.0'
  : 'https://7t8xqn3z95.execute-api.eu-west-1.amazonaws.com/dev/v1.0';
  // API4 - Used for retreive questions for teachers
  export const baseURL4 = environment.production
  ? 'https://7t8xqn3z95.execute-api.eu-west-1.amazonaws.com/dev/v2.0'
  : 'https://7t8xqn3z95.execute-api.eu-west-1.amazonaws.com/dev/v2.0';
export const ImgURL = environment.production
  ? 'https://madrasatie-assets-bucket-dev.s3.eu-west-1.amazonaws.com/'
  : 'https://madrasatie-assets-bucket-dev.s3.eu-west-1.amazonaws.com/';

  //dittofi APIs
  //assessment baseURL
  export const dittofiAssessment = environment.production
  ? 'https://dittofi.com:/1315/iapi/'
  : 'https://dittofi.com:/1315/iapi/';

  //core baseURL
  export const dittofiCore = environment.production
  ? 'https://dittofi.com:/1388/iapi/'
  : 'https://dittofi.com:/1388/iapi/';

export const avayaURL = environment.production
  ? 'https://accounts.avayacloud.com'
  : 'https://onesnastaging.esna.com';

//login
export const adminLogin = baseURL + '/admin/login';
export const userLogin = baseURL + '/users/login?type=School';
//User
export const deactivateActivateUserURL = baseURL + '/user/';
export const editUserURL = baseURL + '/users/';
// Reset Password
export const forgetPasswordURL = baseURL + '/forgetpassword';
export const resetPasswordURL = baseURL + '/resetpassword';
export function hardResetPasswordURL(user_Id) {
  return baseURL + '/user/' + user_Id + '/resetpassword';
}

// Organization
export const getOrganizationsURL = baseURL + '/organizations';
export const getOneOrganizationURL = baseURL + '/organizations/';
export const editOrganizationURL = baseURL + '/organizations/';
export function createOrganizationUser(organization_id) {
  return baseURL + '/organizations/' + organization_id + '/users';
}
export function getOrganizationUsersURL(organization_id) {
  return baseURL + '/organizations/' + organization_id + '/users';
}
export function deleteOrganizationUsersBulkURL(organization_id) {
  return baseURL + '/organizations/' + organization_id + '/user';
}
export const deactivateActivateOrganization = baseURL + '/organization/';
export function deleteOrganizationsURL(organization_id) {
  return baseURL + '/organizations/' + organization_id;
}

// Schools
export const deactivateActivateSchool = baseURL + '/school/';
export const createSchool = baseURL + '/schools';
export const getSchool = baseURL + '/school/';

//academic years

export const getAcademicYears = baseURL + '/school/';

// Schools
export const editSchoolURL = baseURL + '/school/';
export function createStudentURL(school_id) {
  return baseURL2 + '/school/' + school_id + '/student';
}
export function getSchoolUsersURL(school_id) {
  return baseURL + '/school/' + school_id + '/users';
}
export function createSchoolUsersURL(school_id) {
  return baseURL + '/school/' + school_id + '/users';
}

export function deleteAcademicYearURL(
  schoolId: string,
  academicYearId: string
) {
  return baseURL + '/school/' + schoolId + '/academicyear/' + academicYearId;
}

//get Academic year Classes API
export function getYearClasses(schoolId: string) {
  return baseURL + '/school/' + schoolId + '/cay';
}

export function activateAcademicYear(schoolId: string, academicYearId: string) {
  return baseURL + '/school/' + schoolId + '/academicyear/' + academicYearId;
}

//Sections

export function createSection(schoolId: string, cayId: string) {
  return baseURL + '/school/' + schoolId + '/cay/' + cayId + '/section';
}
export function getSectionsOfACAYURL(schoolId: string, cayId: string) {
  return baseURL + '/school/' + schoolId + '/cay/' + cayId + '/section';
}

//get cycles
export function getCycles(schoolId: string) {
  return baseURL + '/school/' + schoolId + '/cycle';
}
//Student
export const RequestProfilePictureLinkURL = baseURL + '/users/profilePicture';
export function getStudentByIDURL(school_id, student_id) {
  return baseURL2 + '/school/' + school_id + '/student/' + student_id;
}
export function GetAllStudentsForSchoolURL(schoolId) {
  return baseURL2 + '/school/' + schoolId + '/student';
}

//Plugins
export function ActivatePluginURL(PluginID, SchoolID) {
  return baseURL + '/plugin/' + PluginID + '/school/' + SchoolID + '/activate';
}
export function DeactivatePluginURL(PluginID, SchoolID) {
  return (
    baseURL + '/plugin/' + PluginID + '/school/' + SchoolID + '/deactivate'
  );
}
export const getAllPluginsURL = baseURL + '/plugins';

//activate/deactivate plugin

export function activateDeactivatePlugin(schoolId: string, pluginId: string) {
  return baseURL + '/plugin/' + pluginId + '/school/' + schoolId;
}

//getSubjects
export function getSubjects(schoolId: string, classId: string) {
  return (
    baseURL +
    '/school/' +
    schoolId +
    '/classOfAcademicYear/' +
    classId +
    '/subject'
  );
}

export function getSectionSubjects(schoolId: string, sectionId: string) {
  return baseURL + '/school/' + schoolId + '/section/' + sectionId + '/subject';
}

//deleteSubjects
export function delSubjects(schoolId: string, subjectId: string) {
  return baseURL + '/school/' + schoolId + '/subject/' + subjectId;
}

//Assign Subjects
export function assignSubjects(schoolID, EmployeeID) {
  return (
    baseURL2 +
    '/school/' +
    schoolID +
    '/employee/' +
    EmployeeID +
    '/assignSubject'
  );
}

//editSubjects
export function editSubjects(schoolId: string, subjectId: string) {
  return baseURL + '/school/' + schoolId + '/subject/' + subjectId;
}

//getCycleClasses
export function getClasses(schoolId: string) {
  return baseURL + '/school/' + schoolId + '/cay';
}

//createSubjects
export function createSubjects(schoolId: string) {
  return baseURL + '/school/' + schoolId + '/subject';
}
//Family
export function CreateParent(school_ID) {
  return baseURL2 + '/school/' + school_ID + '/parent';
}
//employee
export function getEmployee(schoolId: string) {
  return baseURL2 + '/school/' + schoolId + '/employee';
}
export function getEmployeeByIDURL(schoolId: string, EmployeeID) {
  return baseURL2 + '/school/' + schoolId + '/employee/' + EmployeeID;
}

//department
export function getDepartments(schoolId: string) {
  return baseURL2 + '/school/' + schoolId + '/department';
}

//position
export function getPositions(schoolId: string) {
  return baseURL2 + '/school/' + schoolId + '/position';
}

//delete organization user

export function deleteOrganizationUser(organizationId: string, userId: string) {
  return baseURL + '/organizations/' + organizationId + '/user/' + userId;
}

// Question Bank

// export function getAllQuestionsURL() {
//   return baseURL3 + '/questions';
// }
export function getAllQuestionsURL() {
  return baseURL4 + '/admin/questions';
}
export function PublishUnPublishURL(questionID) {
  return baseURL3 + '/questions/' + questionID;
}
export function createQuestionURL() {
  return baseURL3 + '/questions/';
}
export function createQuestionURLV2() {
  return baseURL4 + '/questions/';
}
//publish assessment
export function publishAssessment(assessmentId: string) {
  return baseURL3 + '/assessment/' + assessmentId;
}

//create assessment
export function createAssessment() {
  return baseURL3 + '/assessments';
}

//get assessment
export function getAssessments(assessmentId: string, subjectId: string) {
  return baseURL3 + '/assessments/' + assessmentId + '/subject/' + subjectId;
}

//get All books
export const getBooks = baseURL3 + '/books';

//getBook
export const getBook = baseURL3 + '/book';

// all units
export const getUnits = baseURL3 + '/units';

//domain learning objectives
export function getLOs() {
  return baseURL3 + '/domains/learningObjectives';
}

//filterbybook
export const filter = baseURL3 + '/questions/filter';

//assign questions to assessment
export function assignQuestions(assessmentId: string) {
  return baseURL3 + '/assessments/' + assessmentId + '/assignQuestions';
}
export const getDomainsByCurriculumURL = baseURL3 + '/domains';
export function getLearningObjectivesByDomainURL(domainID) {
  return baseURL3 + '/domains/' + domainID + '/learningObjectives';
}
export const getBloomsTaxonomyURL = baseURL3 + '/bloomstaxonomies';

export function addMetaDataForQuestionsURL(questionID) {
  return baseURL3 + '/questions/' + questionID + '/metadata';
}
export function addRemarkForQuestionkURL(QuestionID) {
  return baseURL3 + '/questions/' + QuestionID + '/remark';
}
export function getRemarksForQuestionURL(questionID) {
  return baseURL3 + '/questions/' + questionID + '/remark';
}
export function ApproveQuestionURL(QuestionID) {
  return baseURL3 + '/questions/' + QuestionID + '/approve';
}
export function getSpecificQuestion(questionID) {
  // TODO : awaiting API
  // return baseURL3 + '/question/' + questionID
}
export function getAssessmentByIDURL(assessmentID) {
  return baseURL3 + '/assessments/' + assessmentID;
}
//correct assessment
export function correctAssessment(assessmentID) {
  return baseURL3 + '/assessments/' + assessmentID + '/correct';
}

export const getAllAssessmentsURL = baseURL3 + '/assessments';

export function startAssessmentURL(assessmentID) {
  return baseURL3 + '/assessments/' + assessmentID + '/start';
}

export function answerFeedback(answerId) {
  return baseURL3 + '/answer/' + answerId + '/feedback';
}
export function StoreStudentsAnswersURL(assessmentID) {
  return baseURL3 + '/assessments/' + assessmentID + '/answers';
}

export const getSuperAdminCurriculum = baseURL3 + '/admin/metadata';

export function getAssessmentResult(assessmentId) {
  return baseURL3 + '/assessments/' + assessmentId + '/results';
}
export function getDomainsAndLOs() {
  return baseURL3 + '/domains/learningObjectives';
}

export function resetAssessment(assessmentId, studentId) {
  return (
    baseURL3 +
    '/assessments/' +
    assessmentId +
    '/student/' +
    studentId +
    '/reset'
  );
}
export function getSubjectNames(schoolID) {
  return baseURL + '/school/' + schoolID + '/subjectNames';
}

export function studentAnswers(assessmentId, studentId) {
  return (
    baseURL3 +
    '/assessments/' +
    assessmentId +
    '/student/' +
    studentId +
    '/answers'
  );
}
export function deleteQuestion(QuestionID) {
  return baseURL3 + '/questions/' + QuestionID;
}
export function questionChanges(questionId) {
  return baseURL3 + '/questions/' + questionId + '/metadata';
}
export function resumeExamURL(assessmentId, studentId) {
  return (
    baseURL3 +
    '/assessments/' +
    assessmentId +
    '/student/' +
    studentId +
    '/resume'
  );
}
export function endExamURL(assessmentId,) {
  return baseURL3 + '/assessments/' + assessmentId + '/markComplete';
}
export function getQuestionByIdURL(QuestionID) {
  return baseURL3 + '/questions/' + QuestionID;
}
export function editQuestionURL(QuestionID) {
  return baseURL3 + '/question/' + QuestionID + '/edit';
}

//avaya access token
export function getAvayaAccessToken(){
  return avayaURL + '/oauth2/access_token';
}

export const getTeacherQuestions = baseURL4 + '/admin/questions';

//wizenose info
export const getLOContent = baseURL3 + '/wize/curatedQuery';

//get student subjects
export function getStudentSubjects(studentId){
  return baseURL2 + '/student/' + studentId + '/subjectsByUserId';
}

//get student result
export function getStudentResult(assessmentId, studentId) {
  return (
    baseURL3 +
    '/assessments/' +
    assessmentId +
    '/student/' +
    studentId +
    '/result'
  );

}
export const bulkDelAssessment = baseURL3 + '/assessment/bulkDelete';

//get student results
export function getStudentResults(subjectId, studentId){
  return baseURL3 + '/subject/' + subjectId + '/student/' + studentId;
}

//super admin login dittofi
export const login_admin_dittofi = dittofiCore + 'v1/super_admin_login';
//user login dittofi
export const login_user_dittofi = dittofiCore + 'v1/user_login';
//get all organizations dittofi
export const get_all_organizations_dittofi = dittofiCore + 'v1/get_all_organizations'
//delete organization dittofi
export function delete_organizations_dittofi(organization_id){
  return dittofiCore + 'v1/destroy_organization?organization_id=' + organization_id;
}
//show organization dittofi
export function show_organizations_dittofi(organization_id){
  return dittofiCore + 'v1/show_organization?organization_id=' + organization_id;
}
//edit organization dittofi
export function edit_organizations_dittofi(organization_id){
  return dittofiCore + 'v1/edit_organization?organization_id=' + organization_id;
}
//create organization dittofi
export const create_organization_dittofi = dittofiCore + 'v1/create_organization'
//activate/deactivate organization dittofi
export function deactivateActivateOrganizationDittofi(organization_id, ToActivate){
  return dittofiCore + 'v1/edit_organization?organization_id=' + organization_id + '&activate='+ToActivate;
}
//get organization users dittofi
export function getOrganizationUsersDittofi(organization_id){
  return dittofiCore + 'v1/get_organization_users?organization_id=' + organization_id;
}

//get academic years per schools dittofi
export function showAcademicYearsDittofi(school_id){
  return dittofiCore + 'v1/show_academic_year?school_id=' + school_id;
}

// destroy academic year dittofi
export function destroyAcademicYearDittofi(id, user_id){
  return dittofiCore + 'v1/destroy_academic_year?id=' + id + '&user_id=' + user_id;
}

//edit academic year dittofi
export function editAcademicYearDittofi(id){
  return dittofiCore + 'v1/edit_academic_year?id=' + id;
}

//create academic year dittofi
export function createAcademicYearDittofi(school_id){
  return dittofiCore + 'v1/create_academic_year?school_id=' + school_id;
}

//activate academic year dittofi
export function activateAcademicYearDittofi(id, activate){
  return dittofiCore + 'v1/validate_academic_year?id=' + id + '&activate=' + activate;
}

//create CAY
export const createCAYDittofi = dittofiCore + 'v1/CAY_create';

//activate academic year dittofi
export function getCAYDittofi(id){
  return dittofiCore + 'v1/CAY_show?cay_id=' + id;
}

export function getAllCAYDittofi(id){
  return dittofiCore + 'v1/CAY_show_all?school_id=' + id;
}

//show cycles dittofi
export function getCyclesDittofi(school_id){
  return dittofiCore + 'v1/cycle_show_all?school_id=' + school_id;
}

//delete cycle dittofi
export function delCycleDittofi(id){
  return dittofiCore + 'v1/cycle_destroy?id=' + id;
}

//edit cycle dittofi
export function editCycleDittofi(id){
  return dittofiCore + 'v1/cycle_edit?id=' + id;
}
//create cycle dittofi
export const createCycleDittofi = dittofiCore + 'v1/cycle_create';

//create section dittofi
export const createSectionDittofi = dittofiCore + 'v1/section_create';

//edit cycle dittofi
export function showSectionsDittofi(school_id, cay_id){
  return dittofiCore + 'v1/section_show_all?school_id=' + school_id+'&cay_id=' + cay_id;
}

//get all classes dittofi
export function getAllClassesDittofi(id){
  return dittofiAssessment + 'v1/get_classes?id=' + id;
}

export function getClassSubjectsAssessment(id){
  return dittofiAssessment + 'v1/get_subjects?grade_id=' + id;
}
//get all classes dittofi
export function getClassSubjectsDittofi(school_id, cay_id){
  return dittofiCore + 'v1/get_class_subjects?school_id=' + school_id+'&class_id=' + cay_id;
}

//get all classes dittofi
export function getSectionSubjectsDittofi(school_id, section_id){
  return dittofiCore + 'v1/get_section_subjects?school_id=' + school_id+'&section_id=' + section_id;
}

//get all classes dittofi
export function deleteSubjectDittofi(subject_id){
  return dittofiCore + 'v1/destroy_subject?subject_id=' + subject_id;
}

//get all classes dittofi
export const createSubjectDittofi =  dittofiCore + 'v1/subject_create';


//get all classes dittofi
export function getClassSectionsDittofi(school_id, cay_id){
  return dittofiCore + 'v1/section_show_all?school_id=' + school_id+'&cay_id=' + cay_id;
}

//get all classes dittofi
export function editSubjectDittofi(subject_id){
  return dittofiCore + 'v1/subject_edit?id=' + subject_id;
}

//get all classes dittofi
export const assignSubjectToEmployeeDittofi = dittofiCore + 'v1/assign_employee_subjects';

//activate/deactivate school
export function deactivateActivateSchoolDittofi(school_id, activate){
  return dittofiCore + 'v1/school_activation?school_id=' + school_id  + '&activate=' + activate;
}

export function addSchoolUser(school_id){
  return dittofiCore + 'v1/school_users_add?school_id=' + school_id;
}

export function editSchoolDittofi(school_id){
  return dittofiCore + 'v1/school_edit?school_id=' + school_id;
}

export const createSchoolDittofi = dittofiCore + 'v1/school_create'

export function showSchoolDittofi(school_id){
  return dittofiCore + 'v1/school_show?school_id=' + school_id;
}

export function destroySchoolDittofi(school_id){
  return dittofiCore + 'v1/destroy_school?school_id=' + school_id;
}

// assessments apis

export function startAssessmentDittofi(assessment_id, student_id){
  return dittofiAssessment + 'v1/start_assessment?assessment_id=' + assessment_id+ '&student_id=' + student_id;
}

export function resetAssessmentDittofi(assessment_id, student_id){
  return dittofiAssessment + 'v1/reset_assessment?assessment_id=' + assessment_id + '&student_id=' + student_id;
}

export function completeAssessmentDittofi(assessment_id, student_id){
  return dittofiAssessment + 'v1/complete_assessment?assessment_id=' + assessment_id+ '&student_id=' + student_id;
}

export const createAssessmentDittofi = dittofiAssessment + 'v1/assessment_create';


export function editAssessmentDittofi(assessment_id){
  return dittofiAssessment + 'v1/assessment_edit?assessment_id=' + assessment_id;
}

export function destroyAssessmentDittofi(assessment_id, user_id){
  return dittofiAssessment + 'v1/assessment_destroy?assessment_id=' + assessment_id + '&user_id=' + user_id;
}

export const bulkDestroyAssessmentDittofi = dittofiAssessment + 'v1/assessment_bulkDestroy';


export function publishAssessmentDittofi(assessment_id){
  return dittofiAssessment + 'v1/assessment_publish?assessment_id=' + assessment_id;
}

export function assessmentAddQuestionsDittofi(assessment_id){
  return dittofiAssessment + 'v1/assessment_addQuestions?assessment_id=' + assessment_id;
}

export function correctAssessmentDittofi(assessment_id, student_id){
  return dittofiAssessment + 'v1/correct_assessment?assessment_id=' + assessment_id + '&student_id=' + student_id;
}

export function showAssessmentDittofi(assessment_id){
  return dittofiAssessment + 'v1/get_assessment_by_id?id=' + assessment_id;
}



export function adminsAssessmentDittofi(subject_id){
  return dittofiAssessment + 'v1/get_assessments_for_admins?subject_id=' + subject_id;
}

export function resumeExamDittofi(assessment_id, student_id){
  return dittofiAssessment + 'v1/resume_exam?assessment_id=' + assessment_id + '&student_id=' + student_id;
}

export const storeAnswersDittofi = dittofiAssessment + 'v1/store_answers';

export function getStudentAnswersDittofi(assessment_id, student_id){
  return dittofiAssessment + 'v1/view_answers?assessment_id=' + assessment_id + '&student_id=' + student_id;
}

export const getAllPluginsDittofi = dittofiCore + 'v1/get_all_plugins';

export function uploadOrganizationLogo(organization_id){
  return dittofiAssessment + 'v1/add_organization_logo?organization_id=' + organization_id;
}

export function activate_user_dittofi(user_id, activate){
  return dittofiCore + 'v1/activate_user?user_id=' + user_id + '&activate=' + activate;
}

export function get_me(user_id){
  return dittofiCore + 'v1/get_me1?id=' + user_id;
}

export function view_students(school_id){
  return dittofiCore + 'v1/student_view_all?school_id=' + school_id;
}

export function student_by_id(id, school_id){
  return dittofiCore + 'v1/student_view?id=' + id + '&school_id=' + school_id;
}

export function createStudentURLDittofi(school_id) {
  return dittofiCore + 'v1/student_create?school_id=' + school_id;
}

export function getEmployeeDittofi(school_id) {
  return dittofiCore + 'v1/get_school_employees?school_id=' + school_id;
}

export function getEployeeByIdDittofi(employee_id) {
  return dittofiCore + 'v1/show_employee?employee_id=' + employee_id;
}

export function showDepsPerSchool(school_id) {
  return dittofiCore + 'v1/show_all_dep_per_school?school_id=' + school_id;
}


export function getPositionsDittofi(school_id) {
  return dittofiCore + 'v1/position_view_all?school_id=' + school_id;
}

export const createDepsDittofi = dittofiCore + 'v1/create_dep';
export const createPosDittofi = dittofiCore + 'v1/position_create';
export const createEmployeeDittofi = dittofiCore + 'v1/create_employee';

export function assignEmployeeDepartmentsDittofi(school_id) {
  return dittofiCore + 'v1/position_view_all?school_id=' + school_id;
}

export function getSubjectAssessments(subject_id) {
  return dittofiAssessment + 'v1/get_subject_assessments?subject_id=' + subject_id;
}

export function getBooksDittofi(grade_code, subject_code) {
  return dittofiAssessment + 'v1/book_showByCode?gradeCode=' + grade_code + '&subjectCode=' + subject_code;
}

export function getUnitsDittofi(grade_code, subject_code, curriculum_id) {
  return dittofiAssessment + 'v1/unit_show?grade_code=' + grade_code + '&subject_code=' + subject_code + '&curriculum_id=' + curriculum_id;
}
export function getBookChapters(book_id) {
  return dittofiAssessment + 'v1/chapter_show?BookId=' + book_id;
}

export function getChapterSections(chapter_id) {
  return dittofiAssessment + 'v1/section_show?chapterId=' + chapter_id;
}

export const get_admin_metadata = dittofiAssessment + 'v1/admin_metadata';

export const filterDittofi = dittofiAssessment + 'v1/question_filter';

export function adminQuestionsDittofi(subject_code, page, size, curriculumId, gradeCode, domainId, learningObjectiveId, status, query){
  return dittofiAssessment + 'v1/admin_questions?subjectCode=' + subject_code + '&page=' + page + '&size=' + size
  +'&curriculumId=' + curriculumId + '&gradeCode=' + gradeCode + '&domainId=' + domainId + '&learningObjectiveId=' + learningObjectiveId
  + '&status=' + status + '&query=' + query;
}

export function getCurriculumDomainsDittofi(curriculumId, grade){
  return dittofiAssessment + 'v1/domain_show?curriculumId=' + curriculumId + '&code=' + grade;
}
export function getDomainLOsDittofi(cur, grade, id){
  return dittofiAssessment + 'v1/lo_by_domains?id=' + id + '&cur=' + cur + '&grade=' + grade;
}

export function destroyUserDittofi(userId, questionId){
  return dittofiAssessment + 'v1/question_destroy?user_id=' + userId + '&question_id=' + questionId;
}

export function question_showOne(questionId){
  return dittofiAssessment + 'v1/question_showOne?question_id=' + questionId;
}
export const getBloomsTaxonomyDittofi = dittofiAssessment + 'v1/bloom_taxonomy_show';


export function teacher_questions(grade_code, subject_code, size, page, query, curriculum){
  return dittofiAssessment + 'v1/teacher_questions?grade_code=' + grade_code +'&subject_code=' + subject_code +
  '&size=' + size + '&page=' + page + '&query=' + query + '&curriculum=' + curriculum;
}

export const createQuestionDittofi = dittofiAssessment + 'v1/question_create';

export function showDomainsDittofi(grade_code, subject_code, curriculum){
  return dittofiAssessment + 'v1/show_domains2?grade_code='
  + grade_code + '&subject_code=' + subject_code+'&curriculum=' + curriculum;
}

export function PublishUnPublishURLDittofi(questionID) {
  return dittofiAssessment + 'v1/question_publish?question_id=' + questionID;
}

export function editQuestionDittofi(questionID) {
  return dittofiAssessment + 'v1/question_edit?QuestionId=' + questionID;
}

export function getStudentAssessments(studentId, school_id, section_id) {
  return dittofiAssessment + 'v1/get_assessments_for_student?student_id=' + studentId + '&school_id=' + school_id + '&section_id=' + section_id;
}

export function getQuestionAnswers(questionID) {
  return dittofiAssessment + 'v1/get_question_answers?id=' + questionID;
}

export function StoreStudentsAnswersURLDittofi(assessmentID) {
  return dittofiAssessment + 'v1/store_answers?id=' + assessmentID;
}

export function completeExamDittofi(assessmentID, studentId) {
  return dittofiAssessment + 'v1/complete_assessment?assessment_id=' + assessmentID+'&student_id=' + studentId;
}


export function addRemarkForQuestionkURLDittofi(question_id) {
  return dittofiAssessment + 'v1/add_remark?id=' + question_id;
}

export function saveQuestionDittofiLebanese(question_id) {
  return dittofiAssessment + 'v1/question_metadata_lebanese?question_id=' + question_id;
}

export function saveQuestionDittofiAmerican(question_id) {
  return dittofiAssessment + 'v1/edit_metadata_american?question_id=' + question_id;
}

export function saveQuestionDittofiBritish(question_id) {
  return dittofiAssessment + 'v1/edit_metadata_british?question_id=' + question_id;
}

export function getAdminClasses(schoolId) {
  return dittofiAssessment + 'v1/get_admin_classes?school_id=' + schoolId;
}
export function createCQ(id) {
  return dittofiAssessment + 'v1/create_cq?id=' + id;
}

export const migrate_questions =  dittofiAssessment + 'v1/migrate_questions';
export const migrate_answers =  dittofiAssessment + 'v1/migrate_answers';
export function getGrades(grade, subject, curriculum) {
  return dittofiAssessment + 'v1/getGrades?gradeCode=' + grade + '&subjectCode=' + subject + '&curriculum=' + curriculum;
}
export function updateDomain(id, grade) {
  return dittofiAssessment + 'v1/update_domain?grade_id=' + grade + '&id=' + id;
}

export function questionById(id) {
  return dittofiAssessment + 'v1/get_question_by_id?id=' + id;
}
export function approveQ(id) {
  return dittofiAssessment + 'v1/question_approve?id=' + id;
}

export function getAssessmentsPerSection(subject_id, section_id) {
  return dittofiAssessment + 'v1/get_assessments_per_section?subject_id=' + subject_id + '&section_id=' + section_id;
}

export function getSectionStudents(section_id) {
  return dittofiAssessment + 'v1/get_section_students?id=' + section_id;
}

export const getSuperAdminClasses = dittofiAssessment + 'v1/get_super_admin_classes';

export function awaitApproval(id, status) {
  return dittofiAssessment + 'v1/send_request_teacher?id=' + id + '&status=' + status;
}
export function superAdminClasses(id) {
  return dittofiAssessment + 'v1/get_super_admin_classes?id=' + id;
}

export function getUnsavedLS(domain_id, description) {
  return dittofiAssessment + 'v1/get_unsaved_ls?domain_id=' + domain_id + '&description=' + description;
}
export function getStudentSubjectsDittofi(section_id) {
  return dittofiAssessment + 'v1/get_student_subjects?section_id=' + section_id;
}
export function getResultsPerStudentDittofi(id, subjectId){
  return dittofiAssessment + 'v1/get_student_assessments_per_subject?id=' + id +'&subject_id=' + subjectId;
}
export function viewStudentResultDittofi(assessment_id, id){
  return dittofiAssessment + 'v1/view_results_student?assessment_id=' + assessment_id + '&id=' + id;
}

export function wizenozeDittofi(query, result_size, userType, userUUID){
  return dittofiAssessment + 'v1/get_wizenose_info?query=' + query + '&resultSize=' + result_size +
  '&userType=' + userType + '%userUUID=' + userUUID;
}


export function getAssesmentStudentsDittofi(assessment_id){
  return dittofiAssessment + 'v1/get_assessment_students?assessment_id=' + assessment_id;
}

export function publishResultsDittofi(assessment_id, publish){
  return dittofiAssessment + 'v1/publish_results?assessment_id=' + assessment_id + '&publish=' + publish;
}

export function addFeedbackDittofi(student_id, assessment_id, answer_id, feedback){
  return dittofiAssessment + 'v1/add_feedback?student_id=' + student_id + '&assessment_id=' + assessment_id
  + '&answer_id=' + answer_id + '&feedback=' + feedback;
}

export function gradeQuestionsDittofi(student_id, assessment_id, answer_id, mark){
  return dittofiAssessment + 'v1/grade_question?student_id=' + student_id + '&assessment_id=' + assessment_id
  + '&answer_id=' + answer_id + '&mark=' + mark;
}

export function viewTeacherResultDittofi(assessment_id, id){
  return dittofiAssessment + 'v1/view_results_teacher?assessment_id=' + assessment_id + '&id=' + id;
}

export function getAttemptsNumber(assessment_id, student_id){
  return dittofiAssessment + 'v1/get_attempt_numbers?assessment_id=' + assessment_id+ '&student_id=' + student_id;
}
export function getAssessmentResults(assessment_id){
  return dittofiAssessment + 'v1/get_assessment_results?id=' + assessment_id;
}
