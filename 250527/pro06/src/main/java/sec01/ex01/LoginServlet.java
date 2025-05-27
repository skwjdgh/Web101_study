package sec01.ex01;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/login") // 서블릿의 매핑 이름이 login입니다.
public class LoginServlet extends HttpServlet
{
    public void init() throws ServletException {
        System.out.println("init 메서드 호출");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        // 웹 브라우저에서 전송한 정보를 톰캣 컨테이너가 HttpServletRequest 객체를 생성한 후 doGet()으로 넘겨줍니다.
        request.setCharacterEncoding("utf-8"); // 전송된 데이터를 UTF-8로 인코딩합니다.
        String user_id = request.getParameter("user_id"); // getParameter()를 이용해 input 태그의 name 속성 값으로 전송된 value를 받아 옵니다.
        String user_pw = request.getParameter("user_pw");
        System.out.println("아이디: " + user_id);
        System.out.println("비밀번호: " + user_pw);
    }

    public void destroy() {
        System.out.println("destroy 메서드 호출");
    }
}