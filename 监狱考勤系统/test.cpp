<update id="insertAttendanceRecord" parameterType="map" >
        UPDATE attendance_table
        SET
        <if test="day == 1">first_day_attendance = #{record}</if>
        <if test="day == 2">second_day_attendance = #{record}</if>
        <if test="day == 3">third_day_attendance = #{record}</if>
        <if test="day == 4">fourth_day_attendance = #{record}</if>
        <if test="day == 5">fifth_day_attendance = #{record}</if>
        <if test="day == 6">sixth_day_attendance = #{record}</if>
        <if test="day == 7">seventh_day_attendance = #{record}</if>
        <if test="day == 8">eighth_day_attendance = #{record}</if>
        <if test="day == 9">ninth_day_attendance = #{record}</if>
        <if test="day == 10">tenth_day_attendance = #{record}</if>
        <if test="day == 11">eleventh_day_attendance = #{record}</if>
        <if test="day == 12">twelfth_day_attendance = #{record}</if>
        <if test="day == 13">thirteenth_day_attendance = #{record}</if>
        <if test="day == 14">fourteenth_day_attendance = #{record}</if>
        <if test="day == 15">fifteenth_day_attendance = #{record}</if>
        <if test="day == 16">sixteenth_day_attendance = #{record}</if>
        <if test="day == 17">seventeenth_day_attendance = #{record}</if>
        <if test="day == 18">eighteenth_day_attendance = #{record}</if>
        <if test="day == 19">nineteenth_day_attendance = #{record}</if>
        <if test="day == 20">twentieth_day_attendance = #{record}</if>
        <if test="day == 21">twentyfirst_day_attendance = #{record}</if>
        <if test="day == 22">twentysecond_day_attendance = #{record}</if>
        <if test="day == 23">twentythird_day_attendance = #{record}</if>
        <if test="day == 24">twentyfourth_day_attendance = #{record}</if>
        <if test="day == 25">twentyfifth_day_attendance = #{record}</if>
        <if test="day == 26">twentysixth_day_attendance = #{record}</if>
        <if test="day == 27">twentyseventh_day_attendance = #{record}</if>
        <if test="day == 28">twentyeighth_day_attendance = #{record}</if>
        <if test="day == 29">twentyninth_day_attendance = #{record}</if>
        <if test="day == 30">thirty_day_attendance = #{record}</if>
        <if test="day == 31">thirtyfirst_day_attendance = #{record}</if>
        FROM
        attendance_data
        WHERE
        employee_user_name = #{username}
        AND attendance_year = #{year}
        AND attendance_month = #{month}
    </update>